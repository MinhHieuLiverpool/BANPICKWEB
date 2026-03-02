export interface ChampionData {
    name: string;
    displayName: string;
    fileName: string;      // used for Champ_ban and Champ_ban_gray
    pickFileName?: string; // used for Champ (pick portrait), falls back to fileName
}

export const CHAMPIONS: ChampionData[] = [
    { name: "Airi", displayName: "Airi", fileName: "Airi" },
    { name: "Aleister", displayName: "Aleister", fileName: "Aleister" },
    { name: "Alice", displayName: "Alice", fileName: "Alice" },
    { name: "Allain", displayName: "Allain", fileName: "Allain" },
    { name: "Amily", displayName: "Amily", fileName: "Amily" },
    { name: "Annette", displayName: "Annette", fileName: "Annette" },
    { name: "AOI", displayName: "AOI", fileName: "AOI" },
    { name: "Arduin", displayName: "Arduin", fileName: "Arduin" },
    { name: "Arthur", displayName: "Arthur", fileName: "Arthur" },
    { name: "Arum", displayName: "Arum", fileName: "Arum" },
    { name: "Astrid", displayName: "Astrid", fileName: "Astrid" },
    { name: "Ata", displayName: "Ata", fileName: "Ata" },
    { name: "Aya", displayName: "Aya", fileName: "Aya", pickFileName: "aya" },
    { name: "Azzen_Ka", displayName: "Azzen'Ka", fileName: "Azzen_Ka" },
    { name: "Baldum", displayName: "Baldum", fileName: "Baldum" },
    { name: "Bijan", displayName: "Bijan", fileName: "Bijan" },
    { name: "Billow", displayName: "Billow", fileName: "Billow" },
    { name: "Biron", displayName: "Biron", fileName: "Biron" },
    { name: "Bolt Baron", displayName: "Bolt Baron", fileName: "Bolt Baron" },
    { name: "Bonnie", displayName: "Bonnie", fileName: "Bonnie" },
    { name: "Bright", displayName: "Bright", fileName: "Bright" },
    { name: "Butterfly", displayName: "Butterfly", fileName: "Butterfly" },
    { name: "Capheny", displayName: "Capheny", fileName: "Capheny" },
    { name: "Celica", displayName: "Celica", fileName: "Celica" },
    { name: "Charlotte", displayName: "Charlotte", fileName: "Charlotte" },
    { name: "Chaugnar", displayName: "Chaugnar", fileName: "Chaugnar" },
    { name: "Cresht", displayName: "Cresht", fileName: "Cresht" },
    { name: "D_arcy", displayName: "D'arcy", fileName: "D_arcy" },
    { name: "Dextra", displayName: "Dextra", fileName: "Dextra" },
    { name: "Dieu Thuyen", displayName: "Điêu Thuyền", fileName: "Điêu Thuyền" },
    { name: "Dirak", displayName: "Dirak", fileName: "Dirak" },
    { name: "Dolia", displayName: "Dolia", fileName: "Dolia" },
    { name: "Edras", displayName: "Edras", fileName: "Edras" },
    { name: "Eland_orr", displayName: "Eland'orr", fileName: "Eland_orr" },
    { name: "Elsu", displayName: "Elsu", fileName: "Elsu" },
    { name: "Enzo", displayName: "Enzo", fileName: "Enzo" },
    { name: "Erin", displayName: "Erin", fileName: "erin" },
    { name: "Errol", displayName: "Errol", fileName: "Errol" },
    { name: "Fennik", displayName: "Fennik", fileName: "Fennik" },
    { name: "Florentino", displayName: "Florentino", fileName: "Florentino" },
    { name: "Gildur", displayName: "Gildur", fileName: "Gildur" },
    { name: "Goverra", displayName: "Goverra", fileName: "Goverra" },
    { name: "Grakk", displayName: "Grakk", fileName: "Grakk" },
    { name: "Hayate", displayName: "Hayate", fileName: "Hayate" },
    { name: "Heino", displayName: "Heino", fileName: "Heino" },
    { name: "Helen", displayName: "Helen", fileName: "Helen" },
    { name: "Iggy", displayName: "Iggy", fileName: "IGGY", pickFileName: "iggy" },
    { name: "Ignis", displayName: "Ignis", fileName: "Ignis" },
    { name: "Ilumia", displayName: "Ilumia", fileName: "Ilumia" },
    { name: "Ishar", displayName: "Ishar", fileName: "Ishar" },
    { name: "Jinna", displayName: "Jinna", fileName: "Jinna" },
    { name: "Kahlii", displayName: "Kahlii", fileName: "KAHLII", pickFileName: "Kahlii" },
    { name: "Kaine", displayName: "Kaine", fileName: "Kaine", pickFileName: "kaine" },
    { name: "Keera", displayName: "Keera", fileName: "Keera" },
    { name: "Kil_Groth", displayName: "Kil'Groth", fileName: "Kil_Groth" },
    { name: "Kriknak", displayName: "Kriknak", fileName: "Kriknak" },
    { name: "Krixi", displayName: "Krixi", fileName: "KRIXI", pickFileName: "Krixi" },
    { name: "Krizzix", displayName: "Krizzix", fileName: "Krizzix" },
    { name: "Lauriel", displayName: "Lauriel", fileName: "Lauriel" },
    { name: "Laville", displayName: "Laville", fileName: "Laville" },
    { name: "Liliana", displayName: "Liliana", fileName: "Liliana" },
    { name: "Lindis", displayName: "Lindis", fileName: "Lindis" },
    { name: "Lorion", displayName: "Lorion", fileName: "Lorion" },
    { name: "Lu Bo", displayName: "Lữ Bố", fileName: "LỮ BỐ", pickFileName: "Lữ bố" },
    { name: "Lumburr", displayName: "Lumburr", fileName: "Lumburr" },
    { name: "Maloch", displayName: "Maloch", fileName: "Maloch" },
    { name: "Marja", displayName: "Marja", fileName: "Marja" },
    { name: "Max", displayName: "Max", fileName: "Max" },
    { name: "Mganga", displayName: "Mganga", fileName: "MGANGA", pickFileName: "Mganga" },
    { name: "Mina", displayName: "Mina", fileName: "MINA", pickFileName: "Mina" },
    { name: "Ming", displayName: "Ming", fileName: "Ming" },
    { name: "Moren", displayName: "Moren", fileName: "Moren" },
    { name: "Murad", displayName: "Murad", fileName: "Murad" },
    { name: "Nakroth", displayName: "Nakroth", fileName: "Nakroth" },
    { name: "Natalya", displayName: "Natalya", fileName: "Natalya" },
    { name: "Ngo Khong", displayName: "Ngộ Không", fileName: "Ngộ Không" },
    { name: "Omega", displayName: "Omega", fileName: "Omega" },
    { name: "Omen", displayName: "Omen", fileName: "Omen" },
    { name: "Ormarr", displayName: "Ormarr", fileName: "Ormarr" },
    { name: "Paine", displayName: "Paine", fileName: "Paine" },
    { name: "Preyta", displayName: "Preyta", fileName: "Preyta" },
    { name: "Qi", displayName: "Qi", fileName: "Qi" },
    { name: "Quillen", displayName: "Quillen", fileName: "Quillen" },
    { name: "Raz", displayName: "Raz", fileName: "Raz" },
    { name: "Richter", displayName: "Richter", fileName: "Richter" },
    { name: "Rouie", displayName: "Rouie", fileName: "Rouie" },
    { name: "Rourke", displayName: "Rourke", fileName: "Rourke" },
    { name: "Roxie", displayName: "Roxie", fileName: "Roxie" },
    { name: "Ryoma", displayName: "Ryoma", fileName: "Ryoma" },
    { name: "Sephera", displayName: "Sephera", fileName: "Sephera" },
    { name: "Sinestrea", displayName: "Sinestrea", fileName: "Sinestrea" },
    { name: "Skud", displayName: "Skud", fileName: "Skud" },
    { name: "Slimz", displayName: "Slimz", fileName: "Slimz" },
    { name: "Stuart", displayName: "Stuart", fileName: "Stuart" },
    { name: "Superman", displayName: "Superman", fileName: "Superman" },
    { name: "Taara", displayName: "Taara", fileName: "Taara" },
    { name: "Tachi", displayName: "Tachi", fileName: "Tachi", pickFileName: "tachi" },
    { name: "TeeMee", displayName: "TeeMee", fileName: "TeeMee" },
    { name: "Teeri", displayName: "Teeri", fileName: "teeri" },
    { name: "Tel_Annas", displayName: "Tel'Annas", fileName: "Tel_Annas" },
    { name: "Thane", displayName: "Thane", fileName: "Thane" },
    { name: "The Flash", displayName: "The Flash", fileName: "The Flash" },
    { name: "Thorne", displayName: "Thorne", fileName: "Thorne" },
    { name: "Toro", displayName: "Toro", fileName: "Toro" },
    { name: "Trieu Van", displayName: "Triệu Vân", fileName: "Triệu Vân" },
    { name: "Tulen", displayName: "Tulen", fileName: "Tulen" },
    { name: "Valhein", displayName: "Valhein", fileName: "Valhein" },
    { name: "Veera", displayName: "Veera", fileName: "Veera" },
    { name: "Veres", displayName: "Veres", fileName: "Veres" },
    { name: "Violet", displayName: "Violet", fileName: "Violet" },
    { name: "Volkath", displayName: "Volkath", fileName: "Volkath" },
    { name: "Wiro", displayName: "Wiro", fileName: "Wiro" },
    { name: "Wisp", displayName: "Wisp", fileName: "Wisp" },
    { name: "Wonder Woman", displayName: "Wonder Woman", fileName: "Wonder Woman" },
    { name: "Xeniel", displayName: "Xeniel", fileName: "Xeniel" },
    { name: "Y_bneth", displayName: "Y'bneth", fileName: "Y_bneth" },
    { name: "Yan", displayName: "Yan", fileName: "Yan" },
    { name: "Yena", displayName: "Yena", fileName: "Yena" },
    { name: "Yorn", displayName: "Yorn", fileName: "Yorn" },
    { name: "Yue", displayName: "Yue", fileName: "Yue", pickFileName: "yue" },
    { name: "Zata", displayName: "Zata", fileName: "Zata" },
    { name: "Zephys", displayName: "Zephys", fileName: "zephys", pickFileName: "Zephys" },
    { name: "Zill", displayName: "Zill", fileName: "Zill" },
    { name: "Zip", displayName: "Zip", fileName: "Zip" },
    { name: "Zuka", displayName: "Zuka", fileName: "Zuka" },
];

export const TEAMS = [
    { shortName: "1S", displayName: "1S" },
    { shortName: "BOX", displayName: "BOX" },
    { shortName: "FPL", displayName: "FPL" },
    { shortName: "FPT", displayName: "FPT" },
    { shortName: "GAM", displayName: "GAM" },
    { shortName: "SGP", displayName: "SGP" },
    { shortName: "SPN", displayName: "SPN" },
    { shortName: "TS", displayName: "TS" },
];

// Logo variants: _B (black bg), _C (color), _F (full), _W (white)
export type LogoVariant = 'B' | 'C' | 'F' | 'W';

export function getChampImageUrl(champ: ChampionData | string, type: 'pick' | 'ban' | 'ban_gray'): string {
    if (type === 'pick') {
        const pf = typeof champ === 'string' ? champ : (champ.pickFileName ?? champ.fileName);
        return `/assets/Champ/${pf}.png`;
    }
    const fn = typeof champ === 'string' ? champ : champ.fileName;
    const folder = type === 'ban_gray' ? 'Champ_ban_gray' : 'Champ_ban';
    return `/assets/${folder}/${fn}.png`;
}

export function getTeamLogoUrl(shortName: string, variant: LogoVariant = 'C'): string {
    return `/assets/LOGOTEAM/${shortName}_${variant}.png`;
}

export function getLaneIconUrl(lane: string): string {
    return `/assets/LANE/${lane}.png`;
}
