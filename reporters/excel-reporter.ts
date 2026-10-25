import ExcelJS from 'exceljs';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { testCases } from '../tests/test-cases';

class ExcelReporter implements Reporter {
  private readonly results = new Map<string, { status: string; error: string }>();

  onTestEnd(test: TestCase, result: TestResult): void {
    const definition = testCases.find(({ id }) => test.title.includes(id));
    if (!definition) return;
    this.results.set(definition.id, {
      status: result.status === 'passed' ? 'Pass' : result.status === 'skipped' ? 'Blocked' : 'Fail',
      error: result.error?.message ?? '',
    });
  }

  async onEnd(_result: FullResult): Promise<void> {
    const reportsDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(reportsDir, { recursive: true });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Execution Report');
    sheet.columns = [
      { header: 'Test Case ID', key: 'id', width: 14 },
      { header: 'Title', key: 'title', width: 38 },
      { header: 'Priority', key: 'priority', width: 10 },
      { header: 'Preconditions', key: 'preconditions', width: 34 },
      { header: 'Steps', key: 'steps', width: 46 },
      { header: 'Expected Result', key: 'expectedResult', width: 44 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Error', key: 'error', width: 50 },
    ];
    const header = sheet.getRow(1);
    header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };

    for (const definition of testCases) {
      const result = this.results.get(definition.id) ?? { status: 'Not Run', error: '' };
      const row = sheet.addRow({ ...definition, status: result.status, error: result.error });
      row.alignment = { vertical: 'top', wrapText: true };
      const statusCell = row.getCell('status');
      const color = result.status === 'Pass' ? 'FFC6EFCE' : result.status === 'Blocked' ? 'FFFFEB9C' : 'FFFFC7CE';
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
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
