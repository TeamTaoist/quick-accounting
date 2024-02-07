declare interface CategoryProperties {
  name: string | undefined;
  type: string | undefined;
  values: string | undefined;
}

declare interface SharePaymentRequestBody {
  amount: string;
  currency_name: string;
  recipient: string;
  decimals: number;
  category_id: null | number;
  category_name: string;
  currency_contract_address?: string;
  category_properties: CategoryProperties[];
}

declare interface ISharePaymentItem {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  workspace_id: number;
  payment_request_id: number;
  recipient: string;
  amount: string;
  decimals: number;
  currency_name: string;
  currency_contract_address: string;
  category_id: number;
  category_name: string;
  category_properties: string;
  safe_tx_hash: string;
  tx_hash: string;
  tx_timestamp: number;
  status: number;
  hide: boolean;
}

interface IShareCategoryProperties {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  workspace_id: number;
  name: string;
  archived: boolean;
  properties: CategoryProperties[];
}

declare interface ISharePaymentList {
  category_and_properties: IShareCategoryProperties[];
  payment_request_items: ISharePaymentItem[] | null;
  workspace: Workspace;
}
