import { NEEDS_WEBGPU, SHADER_FAILED, SUBJECT_SEPARATOR } from "#configuration/strings/card.strings";
import type { ShaderFrame, ShaderPass } from "#types/stage.types";
import { UNIFORM_SLOTS } from "#configuration/constants/card.constants";
import prelude from "../shaders/stage.shader.wgsl?raw";

const HEADER_FLOATS = 4;
const FLOAT_BYTES = 4;
const VERTICES = 3;
const VERTEX_ENTRY = "vertexMain";
const FRAGMENT_ENTRY = "fragmentMain";
const CONTEXT_KIND = "webgpu";
const ERROR_KIND = "error";
const VALIDATION_SCOPE = "validation";
const MESSAGE_SEPARATOR = "; ";
const POSITION_SEPARATOR = ":";

const describe = function describe(message: GPUCompilationMessage): string {
    return `${String(message.lineNum)}${POSITION_SEPARATOR}${String(message.linePos)} ${message.message}`;
};

const uniformData = function uniformData(frame: ShaderFrame): Float32Array<ArrayBuffer> {
    const data = new Float32Array(HEADER_FLOATS + UNIFORM_SLOTS);
    data.set([frame.width, frame.height, frame.time, frame.progress]);
    data.set(frame.values.slice(0, UNIFORM_SLOTS), HEADER_FLOATS);
    return data;
};

const deviceOf = async function deviceOf(): Promise<GPUDevice> {
    if (!("gpu" in navigator)) {
        throw new Error(NEEDS_WEBGPU);
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (adapter === null) {
        throw new Error(NEEDS_WEBGPU);
    }
    return adapter.requestDevice();
};

export const createShaderPass = async function createShaderPass(
    canvas: HTMLCanvasElement,
    source: string,
): Promise<ShaderPass> {
    const device = await deviceOf();
    const context = canvas.getContext(CONTEXT_KIND);
    if (context === null) {
        throw new Error(NEEDS_WEBGPU);
    }
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ alphaMode: "premultiplied", device, format });
    const module = device.createShaderModule({ code: prelude + source });
    const compiled = await module.getCompilationInfo();
    const errors = compiled.messages.filter((message) => message.type === ERROR_KIND);
    if (errors.length > 0) {
        throw new Error(SHADER_FAILED + SUBJECT_SEPARATOR + errors.map(describe).join(MESSAGE_SEPARATOR));
    }
    device.pushErrorScope(VALIDATION_SCOPE);
    const pipeline = device.createRenderPipeline({
        fragment: { entryPoint: FRAGMENT_ENTRY, module, targets: [{ format }] },
        layout: "auto",
        primitive: { topology: "triangle-list" },
        vertex: { entryPoint: VERTEX_ENTRY, module },
    });
    const failed = await device.popErrorScope();
    if (failed !== null) {
        throw new Error(SHADER_FAILED + SUBJECT_SEPARATOR + failed.message);
    }
    const buffer = device.createBuffer({
        size: (HEADER_FLOATS + UNIFORM_SLOTS) * FLOAT_BYTES,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const bindings = device.createBindGroup({
        entries: [{ binding: 0, resource: { buffer } }],
        layout: pipeline.getBindGroupLayout(0),
    });
    return {
        draw: async (frame: ShaderFrame): Promise<void> => {
            device.queue.writeBuffer(buffer, 0, uniformData(frame));
            const encoder = device.createCommandEncoder();
            const pass = encoder.beginRenderPass({
                colorAttachments: [
                    {
                        clearValue: { a: 0, b: 0, g: 0, r: 0 },
                        loadOp: "clear",
                        storeOp: "store",
                        view: context.getCurrentTexture().createView(),
                    },
                ],
            });
            pass.setPipeline(pipeline);
            pass.setBindGroup(0, bindings);
            pass.draw(VERTICES);
            pass.end();
            device.queue.submit([encoder.finish()]);
            await device.queue.onSubmittedWorkDone();
        },
    };
};
