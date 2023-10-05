export class MessageHelper {
    public format(workItemIds: number[]) {
        return `Selected work item ids: ${ workItemIds.join(", ") }`;
    }
}