export type CRMStatus = 'lead' | 'customer' | 'churned' | 'vip';
export type UserRole = 'user' | 'admin' | 'superadmin' | 'student'; // 'student' mentioned in example

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: UserRole | string;
  updated_at?: string;
  crm_tags: string[] | null;
  crm_status: CRMStatus | null;
}

export interface MarketingSegment {
  id: string;
  name: string;
  criteria: {
    role?: string;
    crm_status?: CRMStatus;
    [key: string]: unknown;
  };
  created_at: string;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'failed';

export interface MarketingCampaign {
  id: string;
  subject: string;
  body_html: string;
  segment_id: string;
  status: CampaignStatus;
  sent_count: number;
  sent_at: string | null;
  created_at: string;

  // Optional join fields
  segment?: MarketingSegment;
}
