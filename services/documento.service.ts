import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { supabase } from '@/lib/supabase';
import type { Documento, Cliente } from '@/types';

export const DocumentoService = {
  async getAll(): Promise<Documento[]> {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByClienteId(clienteId: string): Promise<Documento[]> {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  /**
   * Generates a professional .docx for Client Viability
   */
  async generateViabilidad(cliente: Cliente): Promise<Buffer> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "CARTA DE VIABILIDAD - LMS CRÉDITOS",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }), // Spacer
          new Paragraph({
            children: [
              new TextRun({ text: "Fecha: ", bold: true }),
              new TextRun(new Date().toLocaleDateString('es-CO')),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "A la atención de: ", bold: true }),
              new TextRun(cliente.nombre),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Documento: ", bold: true }),
              new TextRun(`${cliente.tipo_documento} ${cliente.numero_documento}`),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Por medio de la presente, LMS CRÉDITOS hace constar que se ha realizado el análisis preliminar de viabilidad para su solicitud de crédito hipotecario.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Basado en la documentación aportada y el perfil crediticio consultado, se determina una VIABILIDAD POSITIVA sujeta a la radicación formal ante las entidades bancarias aliadas.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Este documento tiene carácter informativo y no constituye una aprobación final por parte del banco.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "__________________________",
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "LMS CRÉDITOS S.A.S",
            alignment: AlignmentType.CENTER,
            style: "normal",
          }),
        ],
      }],
    });

    return await Packer.toBuffer(doc);
  },

  /**
   * Generates a professional .docx for Management Contract
   */
  async generateContrato(cliente: Cliente): Promise<Buffer> {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: "CONTRATO DE PRESTACIÓN DE SERVICIOS - GESTIÓN HIPOTECARIA",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: `Entre los suscritos, LMS CRÉDITOS S.A.S y el señor(a) ${cliente.nombre}, identificado con ${cliente.tipo_documento} No. ${cliente.numero_documento}, se celebra el presente contrato de gestión para la obtención de crédito de vivienda.`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "CLÁUSULA PRIMERA: ", bold: true }),
              new TextRun("El objeto del presente contrato es la asesoría, trámite y acompañamiento en la radicación de crédito hipotecario ante entidades financieras."),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "CLÁUSULA SEGUNDA - HONORARIOS: ", bold: true }),
              new TextRun("El cliente se compromete a pagar a LMS CRÉDITOS el porcentaje acordado sobre el valor del crédito aprobado."),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Se firma en señal de aceptación el día: " + new Date().toLocaleDateString('es-CO'),
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "__________________________",
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: cliente.nombre,
            alignment: AlignmentType.CENTER,
          }),
        ],
      }],
    });

    return await Packer.toBuffer(doc);
  },
  /**
   * Deletes a document both from Supabase Storage and the Database
   */
  async deleteDocumento(doc: Documento): Promise<boolean> {
    try {
      if (doc.url_archivo) {
        const filePath = this.extractPathFromUrl(doc.url_archivo);
        
        if (filePath) {
          const { data, error: storageError } = await supabase.storage
            .from('documentos')
            .remove([filePath]);
          
          if (storageError) {
            console.error('FAILED to delete from Storage:', storageError);
          } else if (data && data.length === 0) {
            console.warn('Supabase Storage: File not found for deletion at', filePath);
          } else {
            console.log('Successfully deleted from Storage:', data);
          }
        }
      }

      const { error: dbError } = await supabase
        .from('documentos')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;
      return true;
    } catch (err) {
      console.error('Error in deleteDocumento:', err);
      return false;
    }
  },

  /**
   * Internal helper to extract the safe storage path from a public Supabase URL
   */
  extractPathFromUrl(url: string): string | null {
    try {
      // Búscamos el nombre del bucket en la URL de forma flexible
      const bucket = 'documentos';
      const searchStr = `/${bucket}/`;
      
      if (!url.includes(searchStr)) {
        // Fallback: tratar de encontrarlo después del /public/
        const publicMarker = '/public/';
        if (url.includes(publicMarker)) {
          const parts = url.split(publicMarker);
          // documents/clientId/file.pdf
          const afterPublic = parts[1];
          const pathParts = afterPublic.split('/');
          pathParts.shift(); // Quitar el nombre del bucket
          return decodeURIComponent(pathParts.join('/').split('?')[0]);
        }
        return null;
      }

      const pathPart = url.split(searchStr).pop();
      if (!pathPart) return null;
      
      // Quitar posibles parámetros de consulta (?t=...) y decodificar
      return decodeURIComponent(pathPart.split('?')[0]);
    } catch (e) {
      console.error('Error parsing storage URL:', e);
      return null;
    }
  }
};
