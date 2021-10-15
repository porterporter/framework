export abstract class Event {
	public name: string;
	public event: string;
	public once: boolean;

	constructor(options: { name: string, event: string, once?: boolean }) {
		this.name = options.name;
		this.event = options.event;
		this.once = options.once ?? false;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public abstract run(...args: any[]): any;
}