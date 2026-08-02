export type RingState = {
  scale: number;
  posX: number;
  posY: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  camZ: number;
  cluster: number; // 0..1
};

export const ringState: RingState = {
  scale: 1.3,
  posX: 0,
  posY: -0.65,
  rotX: 0.18,
  rotY: 0,
  rotZ: 0,
  camZ: 4.0,
  cluster: 0,
};

if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).ringState = ringState;
}
