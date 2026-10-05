import type { ByteStep, Secrets, Shell, TransferOptions } from "#types/deployment.types";
import { NOT_CONNECTED } from "#configuration/strings/deployment.strings";
import { NodeSSH } from "node-ssh";
import { SSH_FOLDER } from "#configuration/constants/ssh.constants";
import { homedir } from "node:os";
import { join } from "node:path";
import { readFileSync } from "node:fs";

const transferOf = function transferOf(step: ByteStep | undefined): TransferOptions | null {
    return step === undefined
        ? null
        : {
              step: (transferred: number, _chunk: number, size: number) => {
                  step(transferred, size);
              },
          };
};

const privateKey = function privateKey(keyFile: string): string {
    return readFileSync(join(homedir(), SSH_FOLDER, keyFile), "utf8");
};

export const createShell = function createShell(secrets: Secrets): Shell {
    const ssh = new NodeSSH();
    let connected = false;
    const guard = function guard(): void {
        if (!connected) {
            throw new Error(NOT_CONNECTED);
        }
    };
    const connect = async function connect(): Promise<void> {
        await ssh.connect({
            host: secrets.host,
            privateKey: privateKey(secrets.keyFile),
            username: secrets.user,
            ...(secrets.passphrase === null ? {} : { passphrase: secrets.passphrase }),
        });
        connected = true;
    };
    return {
        connect,
        dispose: () => {
            if (connected) {
                ssh.dispose();
                connected = false;
            }
        },
        download: async (localPath, remotePath, step) => {
            guard();
            await ssh.getFile(localPath, remotePath, null, transferOf(step));
        },
        run: async (command) => {
            guard();
            const result = await ssh.execCommand(command);
            return { code: result.code, stderr: result.stderr, stdout: result.stdout };
        },
        upload: async (localPath, remotePath, step) => {
            guard();
            await ssh.putFile(localPath, remotePath, null, transferOf(step));
        },
    };
};
