export interface KnoblyApp {
    id: string;
    name: string;
    type: string;
    link?: string;
    icon: string;
    color: string;
    borderClass: string;
    category: 'Main' | 'OLevel' | 'CCC';
    isCustom?: boolean;
    isGlobal?: boolean;
    created_at?: string;
}

export interface AppFormData {
    name: string;
    link: string;
    icon: string;
    category: string;
    isGlobal: boolean;
}
