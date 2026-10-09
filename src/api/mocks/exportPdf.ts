import type { ExportPdfRequest } from '../types';

export const mockExportPdf = (body: ExportPdfRequest): Blob => {
  if (!body.zone_id && !body.bbox) {
    throw { kind: 'validation', status: 400, message: 'zone_id or bbox is required' };
  }
  return new Blob(['%PDF-1.4 mock'], { type: 'application/pdf' });
};
