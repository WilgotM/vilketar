#!/usr/bin/env bun
import { spawn } from "child_process";
import { networkInterfaces } from "os";
import QRCode from "qrcode";

function getLocalIP(): string | null {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (!interfaces) continue;
    for (const net of interfaces) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

/** Extract port from CLI args, defaulting to 3000.
 *  Ignores process.env.PORT to avoid conflicts with tools that set it. */
function resolvePort(): string {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "-p" || args[i] === "--port") && args[i + 1]) {
      return args[i + 1];
    }
    if (args[i].startsWith("--port=")) {
      return args[i].split("=")[1];
    }
  }
  return "3000";
}

function formatQR(url: string): Promise<string> {
  return QRCode.toString(url, { type: "utf8" });
}

async function main() {
  const port = resolvePort();
  const localIP = getLocalIP();
  const networkUrl = localIP ? `http://${localIP}:${port}` : null;

  // Strip our own port-related args before passing rest through to Next.js
  const passthroughArgs = process.argv.slice(2).filter((_, i, arr) => {
    const prev = arr[i - 1];
    if (prev === "-p" || prev === "--port") return false;
    return (
      !arr[i].startsWith("--port=") && arr[i] !== "-p" && arr[i] !== "--port"
    );
  });

  const nextArgs = [
    "next",
    "dev",
    "-H",
    "0.0.0.0",
    "-p",
    port,
    ...passthroughArgs,
  ];

  const next = spawn("bun", nextArgs, {
    stdio: ["inherit", "pipe", "pipe"],
    env: { ...process.env, FORCE_COLOR: "1" },
  });

  let qrPrinted = false;

  const onData = (data: Buffer) => {
    const text = data.toString();
    process.stdout.write(text);

    // Print QR code once when Next.js reports the network URL
    if (!qrPrinted && networkUrl && text.includes("Network:")) {
      qrPrinted = true;
      // Small delay so the QR renders after the URL lines
      setTimeout(async () => {
        const qr = await formatQR(networkUrl);
        console.log(`\n  📱  Skanna för att testa på mobilen\n`);
        console.log(`      ${networkUrl}\n`);
        console.log(qr);
        console.log();
      }, 100);
    }
  };

  next.stdout?.on("data", onData);
  next.stderr?.on("data", onData);

  // If next exits (e.g. user hits Ctrl+C), mirror the exit code
  next.on("exit", (code) => {
    process.exit(code ?? 0);
  });

  // Forward termination signals cleanly
  process.on("SIGINT", () => {
    next.kill("SIGINT");
  });

  process.on("SIGTERM", () => {
    next.kill("SIGTERM");
  });
}

main().catch((err) => {
  console.error("dev-with-qr failed:", err);
  process.exit(1);
});
