import { readInputLines } from "../utils.ts";

export async function solve() {
  let safeCount = 0;
  let safeDampenedCount = 0;

  for await (const data of readInputLines("inputs/02.txt")) {
    const report = data.split(" ").map(Number);

    if (isSafeReport(report)) {
      safeCount++;
    }

    if (isSafeReportWithDampener(report)) {
      safeDampenedCount++;
    }
  }

  return [safeCount, safeDampenedCount];
}

function isSafeReport(report: number[]): boolean {
  const sign = Math.sign(report[1] - report[0]);

  for (let i = 1; i < report.length; i++) {
    const diff = report[i] - report[i - 1];

    if (Math.sign(diff) != sign) {
      return false;
    }

    if (![1, 2, 3].includes(Math.abs(diff))) {
      return false;
    }
  }

  return true;
}

function isSafeReportWithDampener(report: number[]): boolean {
  const sign = Math.sign(report[1] - report[0]);
  let count = 0;

  for (let i = 1; i < report.length; i++) {
    const diff = report[i] - report[i - 1];

    if (Math.sign(diff) != sign) {
      return false;
    }

    if (count > 1) return false;

    if (![1, 2, 3].includes(Math.abs(diff))) {
      count++;
    }
  }

  return true;
}
