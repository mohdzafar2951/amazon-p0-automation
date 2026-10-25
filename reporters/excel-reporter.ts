import ExcelJS from 'exceljs';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { testCases } from '../tests/test-cases';

type ExecutionDetails = { actual: string; comments: string };

class ExcelReporter implements Reporter {
  private readonly results = new Map<string, { status: string; error: string; details: ExecutionDetails; screenshot?: string }>();

  onTestEnd(test: TestCase, result: TestResult): void {
    const definition = testCases.find(({ id }) => test.title.includes(id));
    if (!definition) return;
    const detailsAttachment = result.attachments.find((attachment) => attachment.name === 'execution-details');
    const screenshotAttachment = result.attachments.find((attachment) => attachment.contentType === 'image/png' && attachment.path);
    let details: ExecutionDetails = { actual: '', comments: '' };
    if (detailsAttachment?.body) {
      details = JSON.parse(Buffer.from(detailsAttachment.body).toString()) as ExecutionDetails;
    }
    this.results.set(definition.id, {
      status: result.status === 'passed' ? 'Pass' : result.status === 'skipped' ? 'Blocked' : 'Fail',
      error: result.error?.message ?? '',
      details,
      screenshot: screenshotAttachment?.path,
    });
  }

  async onEnd(_result: FullResult): Promise<void> {
    const reportsDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(reportsDir, { recursive: true });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Execution Report');
    sheet.columns = [
      { header: 'Test Case ID', key: 'id', width: 14 },
      { header: 'Test Case Title', key: 'title', width: 28 },
      { header: 'Priority', key: 'priority', width: 9 },
      { header: 'Business Rationale', key: 'rationale', width: 30 },
      { header: 'Preconditions', key: 'preconditions', width: 25 },
      { header: 'Test Data', key: 'testData', width: 20 },
      { header: 'Steps', key: 'steps', width: 32 },
      { header: 'Expected Result', key: 'expectedResult', width: 32 },
      { header: 'Actual Result', key: 'actual', width: 28 },
      { header: 'Status', key: 'status', width: 11 },
      { header: 'Comments', key: 'comments', width: 34 },
      { header: 'Screenshot', key: 'screenshot', width: 22 },
      { header: 'Error', key: 'error', width: 32 },
    ];
    const header = sheet.getRow(1);
    header.height = 32;
    header.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    header.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    for (const definition of testCases) {
      const result = this.results.get(definition.id) ?? { status: 'Not Run', error: '', details: { actual: '', comments: '' } };
      const row = sheet.addRow({
        ...definition,
        testData: 'Configured search keyword',
        actual: result.details.actual || 'Test did not complete.',
        status: result.status,
        comments: result.details.comments,
        screenshot: result.screenshot ? 'See embedded image' : 'Not available',
        error: result.error || '—',
      });
      row.height = 105;
      row.alignment = { vertical: 'top', wrapText: true };
      const statusCell = row.getCell('status');
      const color = result.status === 'Pass' ? 'FFC6EFCE' : result.status === 'Blocked' ? 'FFFFEB9C' : 'FFFFC7CE';
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
      statusCell.font = { bold: true, color: { argb: result.status === 'Pass' ? 'FF006100' : result.status === 'Blocked' ? 'FF9C6500' : 'FF9C0006' } };
      statusCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

      for (const currentRow of [header, row]) {
        currentRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFD9E2F3' } },
            left: { style: 'thin', color: { argb: 'FFD9E2F3' } },
            bottom: { style: 'thin', color: { argb: 'FFD9E2F3' } },
            right: { style: 'thin', color: { argb: 'FFD9E2F3' } },
          };
        });
      }

      if (result.screenshot) {
        try {
          const imageId = workbook.addImage({ filename: result.screenshot, extension: 'png' });
          sheet.addImage(imageId, { tl: { col: 11, row: row.number - 1 }, ext: { width: 140, height: 90 }, editAs: 'oneCell' });
        } catch (error) {
          console.warn(`Could not embed the screenshot for ${definition.id}.`, error);
        }
      }
    }
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
    const reportPath = path.join(reportsDir, 'execution-report.xlsx');
    try {
      await workbook.xlsx.writeFile(reportPath);
    } catch (error) {
      const fallbackPath = path.join(reportsDir, `execution-report-${Date.now()}.xlsx`);
      await workbook.xlsx.writeFile(fallbackPath);
      console.warn(`The primary Excel report is locked. Saved the report to ${fallbackPath}.`, error);
    }
  }
}

export default ExcelReporter;
