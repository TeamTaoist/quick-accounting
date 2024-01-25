declare interface IPaymentRequest {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  payment_request_id: number;
  recipient: string;
  amount: string;
  currency_name: string;
  currency_contract_address: string;
  category_id: number;
  category_name: string;
  category_properties: string;
  safe_id: string;
  tx: string;
  tx_timestamp: number;
  status: number;
  hide: boolean;
}

declare interface ICategoryProperties {
  name: string;
  type: string;
  values: string;
}
declare interface IRows {
  amount: string;
  currency_name: string;
  recipient: string;
  currency_contract_address?: string;
}
declare interface IPaymentRequestBody {
  category_id?: number;
  category_name?: string;
  category_properties?: ICategoryProperties[];
  rows: IRows[];
}