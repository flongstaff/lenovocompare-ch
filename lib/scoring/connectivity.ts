/**
 * Connectivity scoring — ports, wireless, M.2 slots.
 */
import type { Laptop } from "../types";
import type { ScoreComponent } from "./utils";

export interface ConnectivityBreakdown {
  readonly thunderbolt: ScoreComponent;
  readonly usbC: ScoreComponent;
  readonly usbA: ScoreComponent;
  readonly hdmi: ScoreComponent;
  readonly rj45: ScoreComponent;
  readonly sd: ScoreComponent;
  readonly wifi: ScoreComponent;
  readonly bluetooth: ScoreComponent;
  readonly m2Slots: ScoreComponent;
  readonly displayPort: ScoreComponent;
}

/**
 * Connectivity breakdown (max ~100). Point budget:
 * TB4: 10/port (max 25), USB-C: 5/port (max 10), USB-A: 10, HDMI: 8,
 * RJ45: 8, SD: 7, Wi-Fi 7/6E/other: 15/10/5, BT 5.3+: 5, 2+ M.2: 5, DP: 5
 */
export const getConnectivityScoreBreakdown = (model: Laptop): ConnectivityBreakdown => {
  const ports = model.ports;
  const tb4Count = ports.reduce((n, p) => {
    const match = p.match(/^(\d+)x\s.*thunderbolt 4/i);
    return n + (match ? parseInt(match[1], 10) : p.toLowerCase().includes("thunderbolt 4") ? 1 : 0);
  }, 0);
  const usbC = ports.filter((p) => p.toLowerCase().includes("usb-c")).length;

  return {
    thunderbolt: { label: "TB4", earned: Math.min(25, tb4Count * 10), max: 25 },
    usbC: { label: "USB-C", earned: Math.min(10, usbC * 5), max: 10 },
    usbA: { label: "USB-A", earned: ports.some((p) => p.toLowerCase().includes("usb-a")) ? 10 : 0, max: 10 },
    hdmi: { label: "HDMI", earned: ports.some((p) => p.toLowerCase().includes("hdmi")) ? 8 : 0, max: 8 },
    rj45: { label: "RJ45", earned: ports.some((p) => p.toLowerCase().includes("rj45")) ? 8 : 0, max: 8 },
    sd: { label: "SD", earned: ports.some((p) => p.toLowerCase().includes("sd")) ? 7 : 0, max: 7 },
    wifi: {
      label: "Wi-Fi",
      earned: model.wireless.some((w) => w.includes("Wi-Fi 7"))
        ? 15
        : model.wireless.some((w) => w.includes("Wi-Fi 6E"))
          ? 10
          : 5,
      max: 15,
    },
    bluetooth: {
      label: "BT",
      earned: model.wireless.some((w) => w.includes("5.3") || w.includes("5.4")) ? 5 : 0,
      max: 5,
    },
    m2Slots: { label: "M.2", earned: model.storage.slots >= 2 ? 5 : 0, max: 5 },
    displayPort: { label: "DP", earned: ports.some((p) => p.toLowerCase().includes("displayport")) ? 5 : 0, max: 5 },
  };
};

/**
 * Connectivity score (max 100). Delegates to getConnectivityScoreBreakdown so the
 * total always matches the breakdown sum.
 */
export const getConnectivityScore = (model: Laptop): number => {
  const bd = getConnectivityScoreBreakdown(model);
  const sum = Object.values(bd).reduce((acc, c) => acc + c.earned, 0);
  return Math.min(100, sum);
};
