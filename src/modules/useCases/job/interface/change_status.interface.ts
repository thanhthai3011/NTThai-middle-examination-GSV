export interface ILoyaltyProgram {
    lpg_id: string;
    lpg_status?: string;
}

export interface ILoyaltyPromotion {
    lpm_id: string;
    lpm_status?: string;
}

export interface IBenefitType {
    bt_id: string;
    bt_status?: string;
}

export interface IBenefit {
    be_id: string;
    be_status?: string;
}

export interface IVoucherDef {
    vd_id: string;
    vd_status?: string;
}

export interface IVoucher {
    v_id: string;
    v_status?: string;
}
