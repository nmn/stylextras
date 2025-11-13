import * as stylex from "@stylexjs/stylex";

export const animation = stylex.create({
  animation_bounce_1s_infinite: { animation: "animation: bounce 1s infinite" },
  none: { animation: "none" },
  ping_1s_cubic_bezier_lp_0_0_0_2_1_rp_infinite: { animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" },
  pulse_2s_cubic_bezier_lp_0_4_0_0_6_1_rp_infinite: { animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" },
  spin_1s_linear_infinite: { animation: "spin 1s linear infinite" },
});

