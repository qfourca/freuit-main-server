import { Files, Page } from 'notion-api-types/responses';
import { File } from 'notion-api-types/responses/files';

//@ts-expect-error notionpage
export default interface NotionPage extends Page {
  cover: File | Files.External;
}
