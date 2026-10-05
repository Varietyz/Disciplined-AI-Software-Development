fn pool(point: vec2f, center: vec2f, reach: f32) -> f32 {
    let distance = length(point - center) / reach;
    return exp(-distance * distance);
}

fn shade(uv: vec2f, frame: Frame) -> vec4f {
    let aspect = frame.resolution.x / frame.resolution.y;
    let point = vec2f(uv.x * aspect, uv.y);
    let turn = frame.progress * 6.2831853;
    let warm = vec2f((0.28 + 0.1 * cos(turn)) * aspect, 0.5 + 0.16 * sin(turn));
    let gold = vec2f((0.74 + 0.12 * cos(turn + 3.1415927)) * aspect, 0.42 + 0.14 * sin(turn * 2.0 + 1.0));
    let deep = vec2f((0.55 + 0.2 * sin(turn)) * aspect, 1.05 + 0.08 * cos(turn));
    let ground = vec3f(0.075, 0.075, 0.08);
    let pag = vec3f(0.886, 0.533, 0.251);
    let accent = vec3f(0.808, 0.647, 0.333);
    let light = pag * pool(point, warm, 0.5) * 0.17 + accent * pool(point, gold, 0.42) * 0.09 + pag * pool(point, deep, 0.6) * 0.07;
    let vignette = 1.0 - 0.45 * smoothstep(0.35, 0.95, length(uv - vec2f(0.5, 0.5)));
    return vec4f((ground + light * value(0u)) * vignette, 1.0);
}
