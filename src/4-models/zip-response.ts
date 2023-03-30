export class ZipResponse {
    public name: string;
    public path: string;
    public data: Buffer;

    public constructor(name: string, path: string, data: Buffer) {
        this.name = name;
        this.path = path;
        this.data = data;
    }
}