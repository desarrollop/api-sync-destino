// Interface para el detalle de factura
export interface FacturaDetSync {
  ID_FACTURA_DET: number;
  ID_SUCURSAL: string;
  SERIE: string;
  NUMERO_FACTURA: number;
  PRODUCT0: string;
  CODIGO_UNIDAD_VTA: string;
  CANTIDAD_VENDIDA: number;
  CANTIDAD_DEVUELTA?: number;
  COSTO_UNITARIO_PROD: number;
  PRECIO_UNITARIO_VTA: number;
  MONTO_DESCUENTO_DET: number;
  MONTO_IVA: number;
  SUBTOTAL_VENTAS: number;
  SUBTOTAL_GENERAL?: number;
  MONTO_DESCUENTO_LINE?: number;
  CORRELATIVO_INGRESO?: number;
}

// Interface para el encabezado de factura
export interface FacturaEncSync {
  ID_FACTURA_ENC: number;
  ID_SUCURSAL: string;
  SERIE: string;
  NUMERO_FACTURA: number;
  FECHA_DE_FACTURA: string;
  USUARIO_QUE_FACTURA: string;
  MONTO_DESCUENTO_FACT: number;
  IVA_FACTURA: number;
  TOTAL_GENERAL: number;
  NOMBRE_CLI_A_FACTUAR: string;
  NIT_CLIEN_A_FACTURAR: string;
  DIRECCION_CLI_FACTUR: string;
  ESTADO_DE_FACTURA: string;
  CODIGO_DE_CLIENTE: number;
  CODIGO_VENDEDOR: number;
  NUMERO_DE_PEDIDO: number;
  PORC_DESCUENTO_GLOB: number;
  FECHA_ANULACION?: string | null;
  USUARIO_ANULACION?: string | null;
  MOTIVO_ANULACION?: string | null;
  CORRELATIVO?: number | null;
  TIPO_CONTRIBUYENTE?: string | null;
  CORR_CONTINGENCIA?: number | null;
  ESTADO_CERTIFICACION?: string | null;
  CORR_CONTINGENCIA_INT?: number | null;
  DET: FacturaDetSync[];
}

// Interface para la estructura completa de sincronización
export interface FacturaSyncData {
  ENC: FacturaEncSync;
}

// Interface para el resultado del procesamiento
export interface FacturaProcessResult {
  encabezado: {
    success: boolean;
    id?: number;
    message: string;
  };
  detalles: {
    success: boolean;
    count: number;
    message: string;
  };
  timestamp: string;
} 