struct Frame {
    resolution: vec2f,
    time: f32,
    progress: f32,
    values: array<vec4f, 4>,
}

@group(0) @binding(0) var<uniform> frame: Frame;

struct Varying {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
}

fn value(index: u32) -> f32 {
    return frame.values[index / 4u][index % 4u];
}

@vertex
fn vertexMain(@builtin(vertex_index) index: u32) -> Varying {
    let corner = vec2f(f32((index << 1u) & 2u), f32(index & 2u));
    var output: Varying;
    output.position = vec4f(corner * 2.0 - 1.0, 0.0, 1.0);
    output.uv = vec2f(corner.x, 1.0 - corner.y);
    return output;
}

@fragment
fn fragmentMain(input: Varying) -> @location(0) vec4f {
    return shade(input.uv, frame);
}
