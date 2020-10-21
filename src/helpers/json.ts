export function safeJsonParse(str: string): Record<string, any> {
    try {
        return JSON.parse(str);
    } catch (error) {
        return {};
    }
}

export function safeJsonStringify(obj: Record<string, any>): string {
    try {
        return JSON.stringify(obj, null, 2);
    } catch (error) {
        return '';
    }
}
