/* --- SOMSI - SISTEMA DE VALES PRO (SALIDA) --- */

let idDocumentoActual = "";

// --- CATÁLOGO UNIVERSAL DE CONSUMIBLES ---
const CATALOGO_UNIVERSAL = [
    { code: "Q-WD40", desc: "AFLOJATODO", tags: ["wd40", "wd-40", "wd 40", "antioxido", "antioxidante", "afloja todo", "penetrante", "aceite spray", "lubricante spray"] },
    { code: "Q-CRC", desc: "LIMPIADOR DE CARBURADOR", tags: ["carbuclean", "carbu clean", "limpia carburador", "limpiador carburador", "crc", "limpia cuerpo de aceleracion", "troyano"] },
    { code: "Q-DClean", desc: "DIELÉCTRICO", tags: ["dielectrico", "dclean", "d-clean", "limpiador de contactos", "limpia contactos", "contact cleaner", "limpiador electronico"] },
    { code: "Q-Chain", desc: "LUBRICANTE PARA CADENA", tags: ["lubricante de cadena", "aceite para cadena", "grasa para cadena", "chain lube", "spray para cadena", "lubricante chain"] },
    { code: "Q-Grease", desc: "TUBO DE GRASA", tags: ["grasa", "tubo de grasa", "cartucho de grasa", "salchicha de grasa", "grasa lubricante"] },
    { code: "Q-Des-S", desc: "DESENGRASANTE NARANJA SENCILLO", tags: ["desengrasante sencillo", "desengrasante naranja", "desengrasante citrico", "limpiador naranja", "desengrasante normal"] },
    { code: "Q-Des-SD", desc: "DESENGRASANTE NARANJA DILUIDO", tags: ["desengrasante diluido", "desengrasante rebajado", "desengrasante sd", "desengrasante naranja diluido", "desengrasante preparado"] },
    { code: "Q-Des-HD", desc: "DESENGRASANTE CONCENTRADO", tags: ["desengrasante concentrado", "desengrasante hd", "desengrasante pesado", "desengrasante motor", "liquido para motor", "lavamotor", "desengrasante industrial"] },
    { code: "6403", desc: "FLUIDO HIDRÁULICO", tags: ["fluido hidraulico", "aceite hidraulico", "aceite 6403", "hidraulico 6403", "aceite thf", "bote de hidraulico", "cubeta hidraulico"] },
    { code: "L-Clear", desc: "LENTES TRANSPARENTES", tags: ["lentes claros", "lentes transparentes", "gafas claras", "lentes blancos", "lentes seguridad claros"] },
    { code: "L-Black", desc: "LENTES OSCUROS", tags: ["lentes oscuros", "lentes negros", "gafas oscuras", "lentes de sol", "lentes seguridad oscuros", "lentes ahumados"] },
    { code: "C-100...", desc: "CINCHOS DE PLÁSTICO", tags: ["cincho", "cinchos", "cinchos plastico", "corbatas", "corbatas plastico", "tayrap", "ty-rap", "zip ties", "abrazaderas plastico"] },
    { code: "G-AC-M", desc: "GUANTES ANTICORTE TALLA M", tags: ["guantes anticorte m", "guantes anticorte medianos", "guantes grises m", "guantes de corte m", "guantes anticorte talla m"] },
    { code: "G-AC-G", desc: "GUANTES ANTICORTE TALLA G", tags: ["guantes anticorte g", "guantes anticorte grandes", "guantes grises g", "guantes anticorte l", "guantes anticorte talla g", "guantes de corte g"] },
    { code: "G-SN-M", desc: "GUANTES NITRILO TALLA M", tags: ["guantes nitrilo m", "guantes de nitrilo medianos", "guante negro m", "guantes palma nitrilo m", "guantes mecanico m"] },
    { code: "G-SN-G", desc: "GUANTES NITRILO TALLA G", tags: ["guantes nitrilo g", "guantes de nitrilo grandes", "guante nitrilo l", "guantes negros g", "guantes palma nitrilo g"] },
    { code: "CH-UT-N", desc: "CHALECO NARANJA", tags: ["chaleco naranja", "chaleco vial", "chaleco de seguridad", "chaleco reflejante", "chaleco alta visibilidad"] },
    { code: "C-Trapos", desc: "BOLSA DE TRAPOS (20KG)", tags: ["trapos", "bolsa de trapos", "costal de trapos", "trapo industrial", "wape", "huape", "paca de trapos", "franelas"] }
];

// --- CATÁLOGO DE TÉCNICOS ---
const CATALOGO_TECNICOS = [
    { nombre: "Emilio Alarcon", tags: ["emilio", "emi", "emilio alarcon villarreal", "alarcon", "villarreal", "alarcon villarreal", "emilio villarreal", "e alarcon", "emilio a", "e. alarcon"] },
    
    { nombre: "Josue Arreola", tags: ["josue", "josué", "julian", "josue julian", "julian arreola", "josue julian arreola martinez", "arreola", "martinez", "arreola martinez", "josue martinez", "julian martinez", "j arreola", "josue a", "j. arreola"] },
    
    { nombre: "Juan Chavez", tags: ["juan", "juan francisco", "francisco", "pancho", "pancho chavez", "paco", "paco chavez", "francisco chavez", "juan francisco chavez vera", "chavez", "vera", "chavez vera", "juan vera", "j chavez", "juan c", "f chavez"] },
    
    { nombre: "Hugo Garcia", tags: ["hugo", "hugo garcia torres", "garcia", "torres", "garcia torres", "hugo torres", "h garcia", "hugo g", "h. garcia"] },
    
    { nombre: "Carlos Martinez", tags: ["carlos", "omar", "carlos omar", "omar martinez", "carlos omar martinez garcia", "charly", "martinez", "garcia", "martinez garcia", "carlos garcia", "omar garcia", "c martinez", "c. martinez"] },
    
    { nombre: "Guillermo Ramos", tags: ["guillermo", "memo", "memito", "memo ramos", "guillermo ramos hernandez", "ramos", "hernandez", "ramos hernandez", "guillermo hernandez", "g ramos", "guillermo r", "g. ramos"] },
    
    { nombre: "Jose Rojas", tags: ["jose", "josé", "jose emigdio", "emigdio", "emigdio rojas", "jose emigdio rojas garcia", "pepe", "pepito", "pepe rojas", "rojas", "garcia", "rojas garcia", "jose garcia", "emigdio garcia", "j rojas", "j. rojas"] },
    
    { nombre: "Mario Valenzuela", tags: ["mario", "mario valenzuela rocha", "valenzuela", "rocha", "valenzuela rocha", "mario rocha", "mayo", "m valenzuela", "mario v", "m. valenzuela"] },
    
    { nombre: "Juan de Dios", tags: ["juan de dios", "juan de dios acosta", "juan de dios acosta zambrano", "acosta", "zambrano", "acosta zambrano", "juan acosta", "juan zambrano", "jd", "j.d.", "juan d", "jd acosta", "j d acosta"] },
    
    { nombre: "Moises Sedeño", tags: ["moises", "moisés", "moi", "moy", "moises sedeno", "moises sedeño", "moises sedeño aguilar", "sedeno", "sedeño", "aguilar", "sedeño aguilar", "sedeno aguilar", "moises aguilar", "m sedeño", "m sedeno", "moi sedeño", "moy sedeño"] }
];

// --- CATÁLOGO DE SUPERVISORES (AUTORIZA) ---
const CATALOGO_SUPERVISORES = [
    { nombre: "Guillermo Ramos", tags: ["guillermo", "memo", "memito", "memo ramos", "guillermo ramos hernandez", "ramos", "hernandez", "ramos hernandez", "guillermo hernandez", "g ramos", "guillermo r", "g. ramos"] },
    
    { nombre: "Alvaro Alarcon", tags: ["alvaro", "álvaro", "alvaro alarcon haro", "alarcon", "haro", "alarcon haro", "alvaro haro", "a alarcon", "alvaro a", "a. alarcon"] },
    
    { nombre: "Victor Sandez", tags: ["victor", "víctor", "antonio", "victor antonio", "victor antonio sandez garcia", "sandez", "garcia", "sandez garcia", "victor garcia", "antonio sandez", "v sandez", "victor s", "v. sandez"] },
    
    { nombre: "Joseph Castañeda", tags: ["joseph", "omar", "joseph omar", "joseph omar castañeda castro", "joseph castaneda", "castañeda", "castaneda", "castro", "castañeda castro", "castaneda castro", "joseph castro", "omar castañeda", "omar castaneda", "j castañeda", "j castaneda", "joseph c"] },
    
    { nombre: "Delia Castro", tags: ["delia", "guadalupe", "delia guadalupe", "delia guadalupe castro castro", "castro", "castro castro", "delia castro", "d castro", "delia c", "d. castro"] }
];

// --- CATÁLOGO DE EQUIPOS ---
const CATALOGO_EQUIPOS = [
    { eco: "10010546", marca: "GENIE", modelo: "GS-1930", serie: "40631" },
    { eco: "10010592", marca: "ELECTRIC VEHICLE INCORPORATE", modelo: "B820A", serie: "B820A15L01S" },
    { eco: "10010792", marca: "GENIE", modelo: "GS-3246", serie: "GS46P-142607" },
    { eco: "10010793", marca: "GENIE", modelo: "Z-45/25", serie: "Z4525N-57587" },
    { eco: "109", marca: "CLARK", modelo: "CMP25L", serie: "CMP230L-1930-6872KF" },
    { eco: "117", marca: "TOYOTA", modelo: "7FGCU25", serie: "84239" },
    { eco: "118", marca: "CATERPILLAR", modelo: "GC40KS1", serie: "AT87A01431" },
    { eco: "120", marca: "TOYOTA", modelo: "7BDRU15", serie: "34933" },
    { eco: "13", marca: "CROWN", modelo: "RR5220-30", serie: "1A255994" },
    { eco: "151", marca: "CATERPILLAR", modelo: "NRR35", serie: "2GL07125" },
    { eco: "153", marca: "CLARK", modelo: "C25L", serie: "P232L-0089-9878MP" },
    { eco: "154", marca: "CLARK", modelo: "C25L", serie: "P232L-0090-9878MP" },
    { eco: "155", marca: "CLARK", modelo: "C40D", serie: "P455D-0266-9884KF" },
    { eco: "156", marca: "CATERPILLAR", modelo: "GC40KSTR", serie: "AT87A01975" },
    { eco: "16", marca: "KOMATSU", modelo: "FG25ST-12", serie: "562053A" },
    { eco: "161", marca: "CATERPILLAR", modelo: "GC40K-LP-STR", serie: "AT87A10548" },
    { eco: "162", marca: "CATERPILLAR", modelo: "GC40KS1", serie: "AT87A01851" },
    { eco: "165", marca: "CLARK", modelo: "C25L", serie: "P232L-0247-9897MP" },
    { eco: "166", marca: "CLARK", modelo: "C25L", serie: "P232L-0248-9897MP" },
    { eco: "167", marca: "CLARK", modelo: "C25L", serie: "P232L-0249-9897MP" },
    { eco: "171", marca: "CLARK", modelo: "C40D", serie: "P455D-0077-9913KF" },
    { eco: "175", marca: "MITSUBISHI", modelo: "FB20NT-AC", serie: "EFB1450325" },
    { eco: "176", marca: "MITSUBISHI", modelo: "FB20NT-AC", serie: "EFB1450347" },
    { eco: "177", marca: "CROWN", modelo: "RC3020-40", serie: "1A311731" },
    { eco: "178", marca: "MITSUBISHI", modelo: "FB20NT-AC", serie: "EFB1450357" },
    { eco: "179", marca: "MITSUBISHI", modelo: "FB20NT-AC", serie: "EFB1450367" },
    { eco: "180", marca: "JCB", modelo: "930", serie: "SLP3002VE0662785" },
    { eco: "182", marca: "CLARK", modelo: "TMX15", serie: "TMX250-0447-9950MP" },
    { eco: "183", marca: "CLARK", modelo: "TMX15", serie: "TMX250-0431-9950MP" },
    { eco: "185", marca: "NISSAN", modelo: "MCP1F2A25LV", serie: "CP1F2-9P2184" },
    { eco: "186", marca: "NISSAN", modelo: "MCP1F2A25LV", serie: "CP1F2-9P2411" },
    { eco: "193", marca: "CATERPILLAR", modelo: "2EC25E", serie: "A2EC361277" },
    { eco: "198", marca: "CLARK", modelo: "C25L", serie: "P232L-0010-9878MP" },
    { eco: "20", marca: "NISSAN", modelo: "CPJ02A25LV", serie: "CPJ02-9W-3677" },
    { eco: "201", marca: "CLARK", modelo: "C25L", serie: "P232L-0029-9878MP" },
    { eco: "202", marca: "CLARK", modelo: "C25L", serie: "P232L-0033-9878MP" },
    { eco: "203", marca: "CLARK", modelo: "C25L", serie: "P232L-0053-9839CNF" },
    { eco: "204", marca: "CLARK", modelo: "C25L", serie: "P232L-0051-9839CNF" },
    { eco: "205", marca: "CLARK", modelo: "C25C", serie: "C232L-1074-9790KF" },
    { eco: "206", marca: "CLARK", modelo: "C40D", serie: "P455D-0096-9913KF" },
    { eco: "207", marca: "CLARK", modelo: "C25CL", serie: "C232L-0020-9881MP" },
    { eco: "208", marca: "CLARK", modelo: "C25C", serie: "C232L-0012-9881MP" },
    { eco: "209", marca: "CLARK", modelo: "C40D", serie: "P455D-0429-9913KF" },
    { eco: "21", marca: "TOYOTA", modelo: "7FDU35", serie: "60440" },
    { eco: "211", marca: "CLARK", modelo: "C55D", serie: "P455D-0204-9913KF" },
    { eco: "212", marca: "CLARK", modelo: "C25CL", serie: "C232L-0011-9881MP" },
    { eco: "213", marca: "CLARK", modelo: "C25CL", serie: "C232L-0025-9881MP" },
    { eco: "215", marca: "CLARK", modelo: "C40D", serie: "P455D-0038-9884KF" },
    { eco: "217", marca: "CLARK", modelo: "NPR22", serie: "NPR345-0064-9181" },
    { eco: "218", marca: "CLARK", modelo: "C25L", serie: "P232L-0854-9838CN" },
    { eco: "219", marca: "CLARK", modelo: "ECX30", serie: "ECX360-2840-9653KF" },
    { eco: "22", marca: "CROWN", modelo: "RR5010-35", serie: "1A225979" },
    { eco: "220", marca: "CLARK", modelo: "ECX30", serie: "ECX360-1415-9653KF" },
    { eco: "221", marca: "CLARK", modelo: "ECX25", serie: "ECX360-1790-9653KF" },
    { eco: "222", marca: "CLARK", modelo: "C25L", serie: "P232L-0204-9878MP" },
    { eco: "223", marca: "CLARK", modelo: "C30L", serie: "P232L-0004-9972KF" },
    { eco: "224", marca: "CLARK", modelo: "C30L", serie: "P232L-0560-9839CN" },
    { eco: "225", marca: "CLARK", modelo: "C25L", serie: "P232L-0858-9838CNF" },
    { eco: "226", marca: "GENIE", modelo: "GTH-5519", serie: "GTH55M-7127" },
    { eco: "227", marca: "GENIE", modelo: "GTH-5519", serie: "GTH55M-7110" },
    { eco: "228", marca: "GENIE", modelo: "GTH-5519", serie: "GTH55M-6464" },
    { eco: "229", marca: "CLARK", modelo: "C25L", serie: "P232L-0856-9838CNF" },
    { eco: "231", marca: "CLARK", modelo: "C15L", serie: "C152L-0319-9631KF" },
    { eco: "232", marca: "CLARK", modelo: "C25L", serie: "P232L-0874-9838CNF" },
    { eco: "233", marca: "CLARK", modelo: "C25L", serie: "P232L-0857-9838CNF" },
    { eco: "235", marca: "CLARK", modelo: "GTS25L", serie: "GTS232-0081-9995CNF" },
    { eco: "236", marca: "CLARK", modelo: "GTS25L", serie: "GTS232-0077-9995CNF" },
    { eco: "237", marca: "CLARK", modelo: "GTS25L", serie: "GTS232-0079-9995CNF" },
    { eco: "238", marca: "CLARK", modelo: "GTS25L", serie: "GTS232-0080-9995CNF" },
    { eco: "239", marca: "CROWN", modelo: "RR5225-45", serie: "1A287755" },
    { eco: "240", marca: "GENIE", modelo: "GTH-5519", serie: "GTH55M-7115" },
    { eco: "241", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0083-9995CNF" },
    { eco: "242", marca: "CLARK", modelo: "C25L", serie: "P232L-0455-9972KF" },
    { eco: "243", marca: "CLARK", modelo: "C25L", serie: "P232L-0476-9972KF" },
    { eco: "246", marca: "CLARK", modelo: "C50SD", serie: "P455D-0024-8311CNF" },
    { eco: "248", marca: "CLARK", modelo: "TMX17", serie: "TMX250-1055-9977FL" },
    { eco: "249", marca: "CLARK", modelo: "TMX17", serie: "TMX250-0848-9977FL" },
    { eco: "251", marca: "CLARK", modelo: "C500-120", serie: "915-0015-7166FB" },
    { eco: "252", marca: "CLARK", modelo: "CGC40", serie: "CGC400L-0001-6767FB" },
    { eco: "253", marca: "CLARK", modelo: "C25L", serie: "P232L-0002-9572KF" },
    { eco: "254", marca: "CLARK", modelo: "C40D", serie: "P455D-1044-9913KF" },
    { eco: "256", marca: "CLARK", modelo: "TMX20", serie: "TMX250-1275-9977FL" },
    { eco: "257", marca: "CLARK", modelo: "TMX20", serie: "TMX250-1282-9977FL" },
    { eco: "259", marca: "CLARK", modelo: "ECX25", serie: "ECX360-0560-9978FL" },
    { eco: "260", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0312-9995CNF" },
    { eco: "261", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0311-9995CNF" },
    { eco: "262", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0201-9995CNF" },
    { eco: "263", marca: "CLARK", modelo: "CGC25", serie: "C365L-0049-9617GEF" },
    { eco: "264", marca: "CLARK", modelo: "C25L", serie: "C232L-9998-9790" },
    { eco: "265", marca: "CONDOR", modelo: "2548", serie: "X845-3502C" },
    { eco: "266", marca: "CLARK", modelo: "NPR22", serie: "NPR345-1040-9700FL" },
    { eco: "267", marca: "CLARK", modelo: "C40D", serie: "P455D-1051-9913KF" },
    { eco: "269", marca: "CLARK", modelo: "TMX25", serie: "TMX250-1755-9977KY" },
    { eco: "270", marca: "CLARK", modelo: "ECX25", serie: "ECX360-0976-9978KY" },
    { eco: "271", marca: "LINDE", modelo: "GHK2331", serie: "EWR60-2 2692-1295" },
    { eco: "272", marca: "CATERPILLAR", modelo: "GC40KS1", serie: "AT87A01279" },
    { eco: "273", marca: "CATERPILLAR", modelo: "GC40KSTR", serie: "AT87B00042" },
    { eco: "274", marca: "CLARK", modelo: "C25L", serie: "P232L-0410-9862CNF" },
    { eco: "275", marca: "CLARK", modelo: "CQ30", serie: "CQ230L- 0436-9841CNF" },
    { eco: "276", marca: "CLARK", modelo: "C25L", serie: "P232L-0754-9781KF" },
    { eco: "277", marca: "CLARK", modelo: "C30L", serie: "P232L-0915-9839CNF" },
    { eco: "278", marca: "CLARK", modelo: "C30L", serie: "P232L-0726-9839CNF" },
    { eco: "279", marca: "RAYMOND", modelo: "740-R45TT", serie: "740-11-CB22671" },
    { eco: "280", marca: "RAYMOND", modelo: "8410", serie: "841-14-21887" },
    { eco: "281", marca: "CLARK", modelo: "TMX20", serie: "TMX250-0495-9950MP" },
    { eco: "282", marca: "CLARK", modelo: "ECX32", serie: "ECX360-2216-9653KF" },
    { eco: "284", marca: "CLARK", modelo: "ECX32", serie: "ECX360-2220-9653KF" },
    { eco: "285", marca: "CLARK", modelo: "ECX32", serie: "ECX360-2233-9653KF" },
    { eco: "286", marca: "CLARK", modelo: "S25L", serie: "S232L-0018-12000VNF" },
    { eco: "288", marca: "CLARK", modelo: "ECX32", serie: "ECX360-1230-9653KF" },
    { eco: "289", marca: "CLARK", modelo: "S25L", serie: "S232L-0016-12000VNF" },
    { eco: "290", marca: "CLARK", modelo: "S25L", serie: "S232L-0042-12000VNF" },
    { eco: "291", marca: "CLARK", modelo: "S25L", serie: "S232L-0043-12000VNF" },
    { eco: "292", marca: "CLARK", modelo: "S25L", serie: "S232l-1151-10001KF" },
    { eco: "293", marca: "MITSUBISHI", modelo: "", serie: "" },
    { eco: "294", marca: "TOYOTA", modelo: "8FDU32", serie: "60950" },
    { eco: "295", marca: "CLARK", modelo: "C30D", serie: "P232D-1409-9677KF" },
    { eco: "296", marca: "CLARK", modelo: "TMX15", serie: "TMX250-3123-9803KF" },
    { eco: "297", marca: "CLARK", modelo: "TMX15", serie: "TMX250-3117-9803KF" },
    { eco: "298", marca: "CLARK", modelo: "SSX12", serie: "SSX128-0062-8309CNF" },
    { eco: "299", marca: "CLARK", modelo: "NPX20", serie: "NPX345-0240-9701FL" },
    { eco: "300", marca: "CLARK", modelo: "NPX20", serie: "NPX345-0006-9701FL" },
    { eco: "301", marca: "CLARK", modelo: "PWX30", serie: "PWX570-0025-9976FL" },
    { eco: "302", marca: "CLARK", modelo: "HWX30", serie: "HWX570-0042-9975FL" },
    { eco: "303", marca: "CLARK", modelo: "WPX45", serie: "WPX45-2180-8228CH" },
    { eco: "304", marca: "CLARK", modelo: "GCG30", serie: "C365L-1252-9488FB" },
    { eco: "305", marca: "CLARK", modelo: "GCG30", serie: "C365L-0144-9516FB" },
    { eco: "306", marca: "CLARK", modelo: "C55SD", serie: "P455D-0069-9913" },
    { eco: "307", marca: "DREXEL", modelo: "SLT30", serie: "925691-426" },
    { eco: "308", marca: "RAYMOND", modelo: "420-C50QM", serie: "420-09-17524" },
    { eco: "309", marca: "RAYMOND", modelo: "420-C50QM", serie: "420-09-18025" },
    { eco: "311", marca: "RAYMOND", modelo: "750-R45TT", serie: "750-13-AC-37012" },
    { eco: "312", marca: "CLARK", modelo: "S25L", serie: "A51515-P009-1609KF" },
    { eco: "313", marca: "CLARK", modelo: "SSX12", serie: "SSX128-0075-8309CNF" },
    { eco: "314", marca: "CLARK", modelo: "SSX12", serie: "SSX128-0083-8309CNF" },
    { eco: "315", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0020-12025VNF" },
    { eco: "316", marca: "CLARK", modelo: "GTS30L", serie: "GTS232L-0079-12025VNF" },
    { eco: "317", marca: "CLARK", modelo: "GTS30L", serie: "GTS232L-0080-12025VNF" },
    { eco: "318", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0021-12025VNF" },
    { eco: "319", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0023-12025VNF" },
    { eco: "320", marca: "RAYMOND", modelo: "740-DR32TT", serie: "740-08-BB10471" },
    { eco: "321", marca: "RAYMOND", modelo: "740-DR32TT", serie: "740-08-BB10473" },
    { eco: "322", marca: "CLARK", modelo: "NPX22", serie: "NPX345-0086-9701FL" },
    { eco: "323", marca: "CLARK", modelo: "NPX22", serie: "NPX345-0081-9701FL" },
    { eco: "324", marca: "MAXIMAL", modelo: "FBA35-JZ", serie: "A6W1A02194W" },
    { eco: "325", marca: "MAXIMAL", modelo: "FD25T-C4WE3", serie: "A4E9A01892W" },
    { eco: "326", marca: "MAXIMAL", modelo: "FD25T-C4WE3", serie: "A4E9A01891W" },
    { eco: "327", marca: "MAXIMAL", modelo: "FD25T-C4WE3", serie: "A4E9A01890W" },
    { eco: "328", marca: "MAXIMAL", modelo: "FB16S-MHJZ", serie: "A6W0A01742W" },
    { eco: "329", marca: "CLARK", modelo: "NPX22", serie: "NPX345-0082-9701FL" },
    { eco: "330", marca: "CLARK", modelo: "NPX22", serie: "NPX345-0083-9701FL" },
    { eco: "331", marca: "CLARK", modelo: "GTS30L", serie: "GTS232L-0117-12045VNF" },
    { eco: "333", marca: "CLARK", modelo: "S30L", serie: "S232L-1230-12030VNF" },
    { eco: "334", marca: "CLARK", modelo: "S30L", serie: "S232L-1235-12030VNF" },
    { eco: "335", marca: "CLARK", modelo: "S30L", serie: "S232L-1236-12030VNF" },
    { eco: "336", marca: "CLARK", modelo: "S30L", serie: "S232L-1237-12030VNF" },
    { eco: "337", marca: "CLARK", modelo: "S30L", serie: "S232L-1238-12030VNF" },
    { eco: "338", marca: "HANGCHA", modelo: "CPYD25-XW22B1", serie: "12BB03397" },
    { eco: "339", marca: "HANGCHA", modelo: "CPYD25-XW22B1", serie: "12BB03398" },
    { eco: "340", marca: "HANGCHA", modelo: "CPYD25-XW22B1", serie: "12BB03399" },
    { eco: "343", marca: "HANGCHA", modelo: "CPYD25-XW22B1", serie: "12BB03402" },
    { eco: "344", marca: "HANGCHA", modelo: "CPYD25-XW22B1", serie: "12BB03403" },
    { eco: "345", marca: "HANGCHA", modelo: "CPYD25-XW22B1", serie: "12BB03404" },
    { eco: "346", marca: "HANGCHA", modelo: "CPYD25-XW22B1", serie: "12BB03405" },
    { eco: "347", marca: "HANGCHA", modelo: "CPYD25-XW22B1", serie: "12BB03406" },
    { eco: "348", marca: "HANGCHA", modelo: "CPQYD25-XW22B1-C", serie: "11BB00869" },
    { eco: "349", marca: "HANGCHA", modelo: "CPQYD25-XW22B1-C", serie: "11BB00870" },
    { eco: "350", marca: "HANGCHA", modelo: "CPCD25-XW33C-RT4", serie: "19BB00953" },
    { eco: "351", marca: "HANGCHA", modelo: "CPD25-XD2-C", serie: "66BB00216" },
    { eco: "352", marca: "HANGCHA", modelo: "CPD25-XD2-C", serie: "66BB00217" },
    { eco: "353", marca: "HANGCHA", modelo: "CPD25-XD2-C", serie: "66BB00218" },
    { eco: "354", marca: "HANGCHA", modelo: "CPD25-XD2-C", serie: "66BB00219" },
    { eco: "355", marca: "HANGCHA", modelo: "CPD25-XD4-SI26", serie: "36BB02738" },
    { eco: "356", marca: "HANGCHA", modelo: "CPD25-XD4-SI26", serie: "36BB02739" },
    { eco: "357", marca: "CLARK", modelo: "S25L", serie: "S232L-1829-12030VNF" },
    { eco: "358", marca: "CLARK", modelo: "S25L", serie: "S232L-2159-12030VNF" },
    { eco: "359", marca: "HANGCHA", modelo: "CBD22-AC1-NAI", serie: "51BC10242" },
    { eco: "360", marca: "HANGCHA", modelo: "CBD22-AC1-NAI", serie: "51BC10248" },
    { eco: "361", marca: "HANGCHA", modelo: "CBD22-AC1-NAI", serie: "51BC10250" },
    { eco: "362", marca: "HANGCHA", modelo: "CBD22-AC1-NAI", serie: "51BC10261" },
    { eco: "372", marca: "HANGCHA", modelo: "CPD25", serie: "81BC07296" },
    { eco: "373", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BC02409" },
    { eco: "374", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BC02402" },
    { eco: "375", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC11423" },
    { eco: "376", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC11424" },
    { eco: "377", marca: "HANGCHA", modelo: "CPYD25-XW71B1", serie: "12BC05137" },
    { eco: "378", marca: "HANGCHA", modelo: "CPCD25-XW33RC-RT4", serie: "19BD00535" },
    { eco: "379", marca: "HANGCHA", modelo: "CPCD25-XW33RC-RT4", serie: "19BD00536" },
    { eco: "38", marca: "TOYOTA", modelo: "7BRU23", serie: "32364" },
    { eco: "380", marca: "HANGCHA", modelo: "CPCD25-XW33RC-RT4", serie: "19BD00537" },
    { eco: "381", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06907" },
    { eco: "382", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06908" },
    { eco: "383", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06909" },
    { eco: "384", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06910" },
    { eco: "385", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06911" },
    { eco: "386", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06912" },
    { eco: "387", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06913" },
    { eco: "388", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06914" },
    { eco: "389", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06915" },
    { eco: "39", marca: "CROWN", modelo: "RC3020-30", serie: "1A240820" },
    { eco: "390", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06918" },
    { eco: "392", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BD01533" },
    { eco: "393", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06917" },
    { eco: "394", marca: "HANGCHA", modelo: "CBD30", serie: "51BC29242" },
    { eco: "395", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06916" },
    { eco: "397", marca: "CLARK", modelo: "S25L", serie: "S232L-3862-12030" },
    { eco: "398", marca: "HANGCHA", modelo: "CPYD35-XH21B1", serie: "12BD04005" },
    { eco: "399", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD06919" },
    { eco: "4", marca: "TOYOTA", modelo: "5FBE18", serie: "18424" },
    { eco: "400", marca: "HANGCHA", modelo: "CPD55-XD2-CSI", serie: "66BD00271" },
    { eco: "401", marca: "CLARK", modelo: "S40D", serie: "S455D-0150-11025CNF" },
    { eco: "402", marca: "CROWN", modelo: "WP3035-45", serie: "7A273669" },
    { eco: "403", marca: "2025", modelo: "WPX45", serie: "WPX45-4977-8228CH" },
    { eco: "404", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0292-12044VNF" },
    { eco: "405", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0294-12044VNF" },
    { eco: "406", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0298-12044VNF" },
    { eco: "407", marca: "CLARK", modelo: "GTS25L", serie: "GTS232L-0231-12044VNF" },
    { eco: "408", marca: "BENDI LANDOLL", modelo: "B40/48AC180D", serie: "B40/48AC/DS-1506F-09042" },
    { eco: "410", marca: "CLARK", modelo: "C80D", serie: "P680D-0326-9942CNF" },
    { eco: "411", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BE07479" },
    { eco: "412", marca: "CLARK", modelo: "L25L", serie: "L232L-1156-11014" },
    { eco: "413", marca: "CLARK", modelo: "L25L", serie: "L232L-1157-11014" },
    { eco: "414", marca: "CLARK", modelo: "L25L", serie: "L232L-1158-11014" },
    { eco: "415", marca: "CLARK", modelo: "L25L", serie: "L232L-1159-11014" },
    { eco: "416", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BE00648" },
    { eco: "417", marca: "HANGCHA", modelo: "CPD25 -XW33C-RT4", serie: "19BD01178" },
    { eco: "418", marca: "HANGCHA", modelo: "CPD30-XEY2H2-SI", serie: "81BE07918" },
    { eco: "419", marca: "HANGCHA", modelo: "CPYD35-XH21B1", serie: "12BD04004" },
    { eco: "420", marca: "CATERPILLAR", modelo: "906K", serie: "CAT0906KPL6600208" },
    { eco: "421", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BE00369" },
    { eco: "422", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BE00647" },
    { eco: "423", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BD11789" },
    { eco: "424", marca: "HANGCHA", modelo: "CPD25-YEY2HA-SI", serie: "81BE14357" },
    { eco: "425", marca: "HANGCHA", modelo: "CPD35-XEY2H-SI", serie: "81BD13782" },
    { eco: "426", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BE09615" },
    { eco: "427", marca: "BENDI LANDOLL", modelo: "B30/42AC-180D", serie: "B30/42AC/CE-1908B-11921" },
    { eco: "428", marca: "HANGCHA", modelo: "CBD22-AC1-NAI", serie: "51BE09607" },
    { eco: "429", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12568" },
    { eco: "430", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12569" },
    { eco: "431", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12570" },
    { eco: "432", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12571" },
    { eco: "433", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12572" },
    { eco: "434", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12573" },
    { eco: "435", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12574" },
    { eco: "436", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12575" },
    { eco: "437", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12576" },
    { eco: "438", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12577" },
    { eco: "439", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12578" },
    { eco: "440", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12579" },
    { eco: "441", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12580" },
    { eco: "442", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12581" },
    { eco: "443", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12582" },
    { eco: "444", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12583" },
    { eco: "445", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12584" },
    { eco: "446", marca: "HANGCHA", modelo: "CPD25-XEY2H2-SI", serie: "81BF12585" },
    { eco: "447", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BF01507" },
    { eco: "448", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BF01508" },
    { eco: "449", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BF01511" },
    { eco: "450", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BF01512" },
    { eco: "451", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BF01514" },
    { eco: "452", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BF01515" },
    { eco: "453", marca: "HANGCHA", modelo: "CPDS20-XCD8G-SI", serie: "36BF01513" },
    { eco: "48", marca: "CATERPILLAR", modelo: "EPIST-36", serie: "45M01711" },
    { eco: "80", marca: "TOYOTA", modelo: "7FGCU35-BCS", serie: "64373" },
    { eco: "94", marca: "NISSAN", modelo: "MYG1F2A30V", serie: "YG1F2-9M0201" },
    { eco: "99", marca: "KOMATSU", modelo: "FG25HT-14", serie: "589283A" },
    { eco: "A&JPTY", marca: "TOYOTA", modelo: "8FGCU35", serie: "12544" },
    { eco: "ADITAMENTO01", marca: "KAUP", modelo: "2T429-G107B", serie: "8800044280/001" },
    { eco: "BAT01", marca: "ULBS", modelo: "DQ-38.4-920", serie: "LDBE093728" },
    { eco: "BIOPAPPEL01", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC07288" },
    { eco: "BIOPAPPEL02", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC07292" },
    { eco: "BIOPAPPEL03", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC07287" },
    { eco: "BIOPAPPEL04", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC07289" },
    { eco: "BIOPAPPEL05", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC07291" },
    { eco: "BIOPAPPEL06", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC07295" },
    { eco: "BIOPAPPEL07", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC07294" },
    { eco: "BIOPAPPEL08", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC07293" },
    { eco: "BIOPAPPEL09", marca: "HANGCHA", modelo: "CPD25-XEY2H-SI", serie: "81BC07290" },
    { eco: "C12", marca: "TOTALIFT CHARGERS", modelo: "TL36 [AE36 - 483/3/180]", serie: "249891" },
    { eco: "C14", marca: "TOTALIFT CHARGERS", modelo: "TL36 [AE36 - 483/3/180]", serie: "249892" },
    { eco: "C15", marca: "TOTALIFT CHARGERS", modelo: "TL36 [AE36 - 483/3/180]", serie: "250299" },
    { eco: "C16", marca: "TOTALIFT CHARGERS", modelo: "TL36 [AE36 - 483/3/180]", serie: "249889" },
    { eco: "C17", marca: "HC BASIC CHARGER II", modelo: "D48/90 P", serie: "3.37982E+15" },
    { eco: "C18", marca: "HC BASIC CHARGER II", modelo: "D48/90 P", serie: "3.37982E+15" },
    { eco: "C19", marca: "MAXIMAL", modelo: "CZC7SI-D100/175", serie: "22M0601047" },
    { eco: "C20", marca: "MAXIMAL", modelo: "CZB5C-D48/65", serie: "8.12015E+14" },
    { eco: "C21", marca: "ENERGIC PLUS", modelo: "NG-TST-D 36/200", serie: "421403" },
    { eco: "C22", marca: "ENERGIC PLUS", modelo: "NG-TST-D 36/200", serie: "344690" },
    { eco: "C23", marca: "HC BASIC CHARGER II", modelo: "D48/90 P", serie: "3.37982E+15" },
    { eco: "C24", marca: "HC BASIC CHARGER II", modelo: "D48/90 P", serie: "3.37982E+15" },
    { eco: "C25", marca: "ENERSYS", modelo: "EH3-18-1200", serie: "II186487" },
    { eco: "C26", marca: "ENERGIC PLUS", modelo: "NG-TST-D 36/200", serie: "344709" },
    { eco: "C27", marca: "ENERGIC PLUS", modelo: "NG-TST-D 36/180", serie: "421416" },
    { eco: "CEMEXRAILKING", marca: "RAILKING", modelo: "RK300", serie: "RCM 1382-4" },
    { eco: "CMX44296", marca: "LIUGONG", modelo: "CLG2035H", serie: "CCLG2000ZCKT44296" },
    { eco: "CMXHYSTERM4", marca: "HYSTER", modelo: "H3.5UT", serie: "A3C1A10893W" },
    { eco: "GEO8868", marca: "GENIE", modelo: "Z60/34", serie: "Z6008-9415" },
    { eco: "GMO8870", marca: "YALE", modelo: "GLP060VXNVRQ095", serie: "B875VO2690G" },
    { eco: "GMO8876", marca: "CLARK", modelo: "C30C", serie: "C232L-0476-9664" },
    { eco: "GMO9340", marca: "HYSTER", modelo: "H60FT", serie: "L177B22947F" },
    { eco: "GMO9371", marca: "YALE", modelo: "GLP060VXNVRQ095", serie: "B875V10837K" },
    { eco: "GMO9372", marca: "YALE", modelo: "GLC070VXNVRE088", serie: "A910V21230K" },
    { eco: "GN5", marca: "CLARK", modelo: "TMX17", serie: "TMX250-0488-9950MP" },
    { eco: "GN6", marca: "CLARK", modelo: "TMX17", serie: "TMX250-1914-9803 KF" },
    { eco: "GTO8877", marca: "ELECTRIC VEHICLE INCORPORATE", modelo: "B820A", serie: "B820A09B09" },
    { eco: "GTO8878", marca: "ELECTRIC VEHICLE INCORPORATE", modelo: "B820A", serie: "B820A09D01" },
    { eco: "MAS39679", marca: "TOYOTA", modelo: "9BRU18", serie: "9BRU18-39679" },
    { eco: "MASIMO39106", marca: "TOYOTA", modelo: "8BRU18", serie: "39106" },
    { eco: "PRUEBAEXT", marca: "CLARK", modelo: "C25", serie: "P232L-0878-9838-CNF" },
    { eco: "SAHARA-TMX15S", marca: "CLARK", modelo: "TMX15S", serie: "TMX250-1472-9597 KF" },
    { eco: "SB001", marca: "CLARK", modelo: "C25G", serie: "P232G-0081-9879" },
    { eco: "TEST001", marca: "TOYOTA", modelo: "8FBU15", serie: "123456789" },
    { eco: "TSE01", marca: "CLARK", modelo: "TMX25", serie: "TMX250-1600-9977KY" },
    { eco: "TSE04", marca: "CLARK", modelo: "TMX25", serie: "TMX250-1601-9977KY" },
    { eco: "TUGGER01", marca: "NISSAN", modelo: "SGTT1W4G20NV", serie: "1W42-9307743" },
    { eco: "TUGGER02", marca: "NISSAN", modelo: "SGTT1W4G20NV", serie: "1W42-9307744" },
    { eco: "TUGGER05", marca: "NISSAN", modelo: "SGTT1W4G20NV", serie: "2W42-9317678" },
    { eco: "TUGGER06", marca: "NISSAN", modelo: "SGTT1W4G20NV", serie: "2W42-9317677" },
    { eco: "UTCN01798N", marca: "HYSTER", modelo: "T5ZAC", serie: "C476N01798N" },
    { eco: "UTCPH0938055358", marca: "IR", modelo: "CAR CLUB", serie: "PH0938055358" },
    { eco: "UTCV02353M", marca: "YALE", modelo: "GLC050LXNVAE087", serie: "A967V02353M" },
    { eco: "UTCV24296M", marca: "YALE", modelo: "GLC070VXNVRE088", serie: "A910V24296M" }
];

// Inyectar opciones al navegador para sugerencias visuales
function inicializarDatalist() {
    // 1. Datalist de Consumibles
    let datalistConsumibles = document.getElementById('listaConsumiblesBase');
    if (!datalistConsumibles) {
        datalistConsumibles = document.createElement('datalist');
        datalistConsumibles.id = 'listaConsumiblesBase';
        document.body.appendChild(datalistConsumibles);
    }
    CATALOGO_UNIVERSAL.forEach(item => {
        const option = document.createElement('option');
        option.value = item.desc;
        datalistConsumibles.appendChild(option);
    });

    // 2. Datalist de Técnicos
    let datalistTecnicos = document.getElementById('listaTecnicosBase');
    if (!datalistTecnicos) {
        datalistTecnicos = document.createElement('datalist');
        datalistTecnicos.id = 'listaTecnicosBase';
        document.body.appendChild(datalistTecnicos);
    }
    CATALOGO_TECNICOS.forEach(tec => {
        const option = document.createElement('option');
        option.value = tec.nombre;
        datalistTecnicos.appendChild(option);
    });

    // 3. Datalist de Supervisores (Autoriza)
    let datalistSupervisores = document.getElementById('listaSupervisoresBase');
    if (!datalistSupervisores) {
        datalistSupervisores = document.createElement('datalist');
        datalistSupervisores.id = 'listaSupervisoresBase';
        document.body.appendChild(datalistSupervisores);
    }
    CATALOGO_SUPERVISORES.forEach(sup => {
        const option = document.createElement('option');
        option.value = sup.nombre;
        datalistSupervisores.appendChild(option);
    });
    // 4. Datalist de Equipos (Nº Económico)
    let datalistEquipos = document.getElementById('listaEquiposBase');
    if (!datalistEquipos) {
        datalistEquipos = document.createElement('datalist');
        datalistEquipos.id = 'listaEquiposBase';
        document.body.appendChild(datalistEquipos);
    }
    CATALOGO_EQUIPOS.forEach(eq => {
        const option = document.createElement('option');
        option.value = eq.eco;
        datalistEquipos.appendChild(option);
    });
}

window.historialLocal = []; // Almacena en memoria el historial para filtrados e impresiones

const OBTENER_PIN_ALMACEN = () => localStorage.getItem("somsi_pin_almacen") || "1234";
const OBTENER_DICCIONARIO = () => JSON.parse(localStorage.getItem("somsi_diccionario") || "{}");

function normalizarConcepto(descripcion) {
    if (!descripcion) return "";
    const clave = descripcion.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const dict = OBTENER_DICCIONARIO();
    return dict[clave] || descripcion.trim().toUpperCase();
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarDatalist(); 
    
    // 1. Configurar autocompletado para el campo del Técnico
    const inputTecnico = document.getElementById('tecnicoNombre');
    if (inputTecnico) {
        inputTecnico.setAttribute('list', 'listaTecnicosBase');
        
        inputTecnico.addEventListener('change', (e) => {
            const textoOriginal = e.target.value;
            const textoLimpio = textoOriginal.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (!textoLimpio) return;

            const coincidencia = CATALOGO_TECNICOS.find(tec => {
                if (tec.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === textoLimpio) return true;
                return tec.tags.some(tag => textoLimpio.includes(tag));
            });

            if (coincidencia) {
                e.target.value = coincidencia.nombre;
                e.target.style.backgroundColor = "#e8f5e9";
                setTimeout(() => { e.target.style.backgroundColor = "var(--input-bg)"; }, 600);
            }
        });
    }

    // 2. Configurar auto-llenado para el Equipo a partir del Nº Económico
    const inputEco = document.getElementById('equipoEco');
    const inputMarca = document.getElementById('equipoMarca');
    const inputModelo = document.getElementById('equipoModelo');
    const inputSerie = document.getElementById('equipoSerie');

    if (inputEco) {
        inputEco.addEventListener('input', (e) => {
            const ecoBuscado = e.target.value.trim().toUpperCase();
            
            // Si borran el número económico, limpiamos los demás campos y detenemos la función
            if (!ecoBuscado) {
                if (inputMarca) inputMarca.value = "";
                if (inputModelo) inputModelo.value = "";
                if (inputSerie) inputSerie.value = "";
                return;
            }

            const coincidencia = CATALOGO_EQUIPOS.find(eq => String(eq.eco).toUpperCase() === ecoBuscado);

            if (coincidencia) {
                // Si encuentra el equipo, llena los datos
                if (inputMarca) inputMarca.value = coincidencia.marca;
                if (inputModelo) inputModelo.value = coincidencia.modelo;
                if (inputSerie) inputSerie.value = coincidencia.serie;
                
                // Efecto visual verde
                [e.target, inputMarca, inputModelo, inputSerie].forEach(el => {
                    if(el) {
                        el.style.backgroundColor = "#e8f5e9";
                        setTimeout(() => { el.style.backgroundColor = "var(--input-bg)"; }, 600);
                    }
                });
            } else {
                // Si escriben un número que NO existe en el catálogo, también limpia los campos
                if (inputMarca) inputMarca.value = "";
                if (inputModelo) inputModelo.value = "";
                if (inputSerie) inputSerie.value = "";
            }
        });
    }

    // 3. Configurar autocompletado para el campo de Autoriza (Supervisor)
    const inputSupervisor = document.getElementById('supervisorNombre');
    if (inputSupervisor) {
        inputSupervisor.setAttribute('list', 'listaSupervisoresBase');
        
        inputSupervisor.addEventListener('change', (e) => {
            const textoOriginal = e.target.value;
            const textoLimpio = textoOriginal.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (!textoLimpio) return;

            const coincidencia = CATALOGO_SUPERVISORES.find(sup => {
                if (sup.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === textoLimpio) return true;
                return sup.tags.some(tag => textoLimpio.includes(tag));
            });

            if (coincidencia) {
                e.target.value = coincidencia.nombre;
                e.target.style.backgroundColor = "#e8f5e9";
                setTimeout(() => { e.target.style.backgroundColor = "var(--input-bg)"; }, 600);
            }
        });
    }

    // Inicializaciones
    if (document.getElementById('itemsBody') && document.getElementById('itemsBody').children.length === 0) {
        window.addRow();
    }
    if (typeof window.generarSiguienteFolio === "function") {
        setTimeout(window.generarSiguienteFolio, 1000);
    }
});

window.addRow = function () {
    window.vibrar('clic');
    const tbody = document.getElementById('itemsBody');
    const tr = document.createElement('tr');
    tr.className = "fila-item-nueva";
    
    // NOTA: Se añadió 'list="listaConsumiblesBase"' en desc-field
    tr.innerHTML = `
        <td><input type="number" class="cant-field" value="1"></td>
        <td><input type="text" class="desc-field" placeholder="Descripción..." list="listaConsumiblesBase"></td>
        <td><input type="text" class="code-field" placeholder="Código..."></td>
        <td class="no-print">
            <button onclick="this.parentElement.parentElement.remove(); window.evaluarEstadoFormulario();" class="btn-del" style="background:none;border:none;color:red;cursor:pointer;font-size:1.2rem;">×</button>
        </td>`;
    tbody.appendChild(tr);

    const cantInput = tr.querySelector('.cant-field');
    const descInput = tr.querySelector('.desc-field');
    const codeInput = tr.querySelector('.code-field');

    // --- LÓGICA DE AUTO-REEMPLAZO UNIVERSAL ---
    descInput.addEventListener('change', (e) => {
        const textoOriginal = e.target.value;
        const textoLimpio = textoOriginal.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (!textoLimpio) return;

        // Buscar coincidencia en diccionario (por nombre oficial o sinónimos)
        const coincidencia = CATALOGO_UNIVERSAL.find(item => {
            if (item.desc.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === textoLimpio) return true;
            return item.tags.some(tag => textoLimpio.includes(tag));
        });

        // Si hay match, auto-rellenar y dar feedback visual (color verde)
        if (coincidencia) {
            e.target.value = coincidencia.desc;
            codeInput.value = coincidencia.code;
            
            e.target.style.backgroundColor = "#e8f5e9";
            codeInput.style.backgroundColor = "#e8f5e9";
            setTimeout(() => {
                e.target.style.backgroundColor = "var(--input-bg)";
                codeInput.style.backgroundColor = "var(--input-bg)";
            }, 600);
        }
    });

    // --- NAVEGACIÓN POR ENTER ---
    cantInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); descInput.focus(); descInput.select(); }
    });
    descInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); codeInput.focus(); codeInput.select(); }
    });
    codeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.addRow();
            const ultimaFila = tbody.lastElementChild;
            if (ultimaFila) {
                const nuevaCant = ultimaFila.querySelector('.cant-field');
                nuevaCant.focus();
                nuevaCant.select();
            }
        }
    });
};
window.filtrarHistorial = function () {
    const texto = document.getElementById('busquedaEco').value.toUpperCase().trim();
    const filas = document.querySelectorAll('.fila-historial');
    filas.forEach(fila => {
        const eco = fila.getAttribute('data-eco') || "";
        fila.style.display = eco.includes(texto) ? "" : "none";
    });
};

window.generarSiguienteFolio = async function () {
    const { doc, getDoc } = window.dbFuncs;
    try {
        const docRef = doc(window.db, "config", "folios");
        const docSnap = await getDoc(docRef);
        let siguiente = 1;
        if (docSnap.exists()) {
            siguiente = (docSnap.data().ultimoFolio || 0) + 1;
        }
        document.getElementById('folioVale').value = siguiente;
    } catch (e) {
        console.error("Error al obtener folio maestro:", e);
    }
};

window.procesarVale = async function () {
    const btn = document.querySelector('.btn-pdf');
    if (btn.disabled) return;
    
    window.evaluarEstadoFormulario();
    if (!formularioModificado) {
        window.mostrarToast("⚠️ El vale está completamente vacío. Ingresa al menos un dato antes de guardar.", "advertencia");
        return;
    }

    btn.disabled = true;
    btn.innerText = "GUARDANDO...";

    try {
        await window.guardarEnNube();
        await window.exportarPDF();
        window.marcarFormularioComoLimpio();
        btn.innerText = "¡VALE GUARDADO!";
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = "GENERAR PDF Y GUARDAR";
        }, 3000);
    } catch (e) {
        window.mostrarToast("Error al procesar: " + e.message, "error");
        btn.disabled = false;
        btn.innerText = "REINTENTAR";
    }
};

window.guardarEnNube = async function () {
    const { collection, doc, runTransaction } = window.dbFuncs;
    const sfDocRef = doc(window.db, "config", "folios");
    let folioAsignado;

    try {
        await runTransaction(window.db, async (transaction) => {
            const sfDoc = await transaction.get(sfDocRef);

            let nuevoFolio = 1;
            if (sfDoc.exists()) {
                nuevoFolio = (sfDoc.data().ultimoFolio || 0) + 1;
            }

            folioAsignado = nuevoFolio;

            const valeData = {
                folio: folioAsignado,
                tecnico: document.getElementById('tecnicoNombre').value,
                supervisor: document.getElementById('supervisorNombre').value,
                notas: document.getElementById('notesArea').innerText,
                timestamp: Date.now(),
               equipo: {
                    economico: document.getElementById('equipoEco').value,
                    marca: document.getElementById('equipoMarca').value,
                    modelo: document.getElementById('equipoModelo').value, // NUEVO
                    serie: document.getElementById('equipoSerie').value
                },
                items: Array.from(document.querySelectorAll('#itemsBody tr'))
                    .map(tr => ({
                        cant: tr.querySelector('.cant-field')?.value || '1',
                        desc: tr.querySelector('.desc-field')?.value?.trim() || '',
                        code: tr.querySelector('.code-field')?.value?.trim() || ''
                    }))
                    .filter(item => item.desc !== "")
            };

            const valesRef = collection(window.db, "vales");
            const nuevoValeRef = doc(valesRef);
            transaction.set(nuevoValeRef, valeData);
            transaction.set(sfDocRef, { ultimoFolio: folioAsignado }, { merge: true });
        });

        document.getElementById('folioVale').value = folioAsignado;
    } catch (e) {
        console.error("Error en la transacción: ", e);
        throw e;
    }
};

window.cargarHistorialDesdeNube = async function () {
    const { collection, getDocs, query, orderBy } = window.dbFuncs;
    const container = document.getElementById('historialBody');
    try {
        const q = query(collection(window.db, "vales"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        container.innerHTML = "";
        window.historialLocal = [];

        snapshot.forEach(docSnap => {
            const v = docSnap.data();
            const id = docSnap.id;
            window.historialLocal.push({ ...v, idDocumento: id });

            const fechaHora = new Date(v.timestamp).toLocaleString('es-MX', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            const tr = document.createElement('tr');
            tr.classList.add('fila-historial');
            const ecoTexto = v.equipo && v.equipo.economico ? v.equipo.economico.toUpperCase() : "";
            tr.setAttribute('data-eco', ecoTexto);

            tr.innerHTML = `
                <td style="font-size: 0.8rem;">${fechaHora}</td>
                <td>${v.folio}</td>
                <td><strong>${ecoTexto}</strong></td>
                <td>
                    <button class="btn-cargar" onclick='cargarValeEnPantalla("${id}", ${JSON.stringify(v)})'>VER / EDITAR</button>
                    <button class="btn-del-mini" onclick="eliminarVale('${id}')">🗑️</button>
                </td>
            `;
            container.appendChild(tr);
        });
    } catch (e) {
        console.error("Error al cargar historial:", e);
    }
};

window.cargarValeEnPantalla = function (docId, v) {
    idDocumentoActual = docId;

    document.getElementById('folioVale').value = v.folio;
    document.getElementById('tecnicoNombre').value = v.tecnico || "";
    document.getElementById('supervisorNombre').value = v.supervisor || "";
    document.getElementById('equipoEco').value = v.equipo ? v.equipo.economico : "";
    document.getElementById('equipoMarca').value = v.equipo ? v.equipo.marca : "";
    document.getElementById('equipoModelo').value = v.equipo ? (v.equipo.modelo || "") : ""; // NUEVO
    document.getElementById('equipoSerie').value = v.equipo ? v.equipo.serie : "";
    document.getElementById('notesArea').innerText = v.notas || "";

    const tbody = document.getElementById('itemsBody');
    tbody.innerHTML = "";

    if (v.items && v.items.length > 0) {
        v.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = "fila-item-existente";
            tr.innerHTML = `
                <td><input type="number" class="cant-field item-bloqueado" value="${item.cant}" readonly></td>
                <td><input type="text" class="desc-field item-bloqueado" value="${item.desc}" readonly></td>
                <td><input type="text" class="code-field item-bloqueado" value="${item.code}" readonly></td>
                <td class="no-print"><span style="color:gray;">🔒</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.setModoLectura(true);
    window.marcarFormularioComoLimpio();
    window.toggleHistorial();
};

window.eliminarVale = async function (id) {
    if (!confirm("¿Seguro que deseas eliminar este registro del historial?")) return;
    const { doc, deleteDoc } = window.dbFuncs;
    try {
        await deleteDoc(doc(window.db, "vales", id));
        window.cargarHistorialDesdeNube();
    } catch (e) { window.mostrarToast("Error al eliminar: " + e.message, "error"); }
};

window.exportarPDF = async function () {
    window.evaluarEstadoFormulario();
    if (!formularioModificado) {
        window.mostrarToast("⚠️ No puedes generar un PDF de un vale completamente vacío.", "advertencia");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(164, 198, 57);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SOMSI - VALE DE SALIDA", 15, 18);

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");

    doc.text(`TÉCNICO: ${document.getElementById('tecnicoNombre').value.toUpperCase()}`, 15, 37);
    doc.text(`SUPERVISOR: ${document.getElementById('supervisorNombre').value.toUpperCase()}`, 15, 44);
    doc.text(`ECONÓMICO: ${document.getElementById('equipoEco').value.toUpperCase()}`, 15, 51);
    doc.text(`MARCA: ${document.getElementById('equipoMarca').value.toUpperCase()}`, 110, 51);
    doc.text(`MODELO: ${document.getElementById('equipoModelo').value.toUpperCase()}`, 15, 58);
    doc.text(`SERIE: ${document.getElementById('equipoSerie').value.toUpperCase()}`, 110, 58);
    doc.text(`FOLIO: ${document.getElementById('folioVale').value}`, 160, 37);
    doc.text(`FECHA/HORA: ${new Date().toLocaleString()}`, 145, 44);

    const rows = Array.from(document.querySelectorAll('#itemsBody tr')).map(tr => [
        tr.querySelector('.cant-field').value,
        tr.querySelector('.desc-field').value.toUpperCase(),
        tr.querySelector('.code-field').value.toUpperCase()
    ]);

    let tamanoFuente = 10;
    let rellenoCelda = 4;

    if (rows.length > 20) {
        tamanoFuente = 8;
        rellenoCelda = 1.5;
    } else if (rows.length > 12) {
        tamanoFuente = 9;
        rellenoCelda = 3;
    }

    doc.autoTable({
        startY: 63,
        head: [['CANT', 'DESCRIPCIÓN', 'CÓDIGO']],
        body: rows,
        headStyles: { fillColor: [20, 20, 20], textColor: [164, 198, 57] },
        styles: { fontSize: tamanoFuente, cellPadding: rellenoCelda },
        margin: { top: 15, bottom: 40, left: 15, right: 15 }
    });

    let fY = doc.lastAutoTable.finalY + 6;

    const notas = document.getElementById('notesArea').innerText;
    if (notas) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        const splitNotas = doc.splitTextToSize(`NOTAS: ${notas.toUpperCase()}`, 180);

        if (fY + (splitNotas.length * 4) > 245) {
            doc.addPage();
            fY = 25;
        }
        doc.text(splitNotas, 15, fY);
        fY += (splitNotas.length * 4) + 6;
    }

    if (fY > 245) {
        doc.addPage();
        fY = 50;
    } else {
        fY = Math.max(fY + 8, 250);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.line(15, fY, 65, fY);
    doc.text("ALMACÉN", 40, fY + 5, { align: "center" });

    doc.line(80, fY, 130, fY);
    doc.text("TÉCNICO", 105, fY + 5, { align: "center" });

    doc.line(145, fY, 195, fY);
    doc.text("AUTORIZA", 170, fY + 5, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.text(document.getElementById('supervisorNombre').value.toUpperCase(), 170, fY + 10, { align: "center" });

    window.open(doc.output('bloburl'), '_blank');
};

window.nuevoVale = function () {
    if (!confirm("¿Deseas limpiar todo para un nuevo vale?")) return;
    idDocumentoActual = "";
    document.querySelectorAll('input').forEach(i => i.value = "");
    document.getElementById('notesArea').innerText = "";
    document.getElementById('itemsBody').innerHTML = "";
    window.addRow();
    window.setModoLectura(false);
    window.generarSiguienteFolio();
    window.marcarFormularioComoLimpio();
};

window.setModoLectura = function (b) {
    document.querySelectorAll('input, .textarea-mock').forEach(i => {
        if (i.id !== "folioVale") {
            i.readOnly = b;
            i.style.backgroundColor = b ? "var(--input-bg)" : "";
        }
    });
    const btn = document.querySelector('.btn-pdf');
    btn.onclick = b ? window.exportarPDF : window.procesarVale;
    btn.innerText = b ? "RE-GENERAR PDF" : "GENERAR PDF Y GUARDAR";
};

window.toggleHistorial = function () {
    const modal = document.getElementById('modalHistorial');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) window.cargarHistorialDesdeNube();
};

window.toggleModalResumen = function () {
    const modal = document.getElementById('modalResumenTecnico');
    const displayActual = modal.style.display;
    modal.style.display = (displayActual === 'none' || displayActual === '') ? 'flex' : 'none';
};

window.generarResumen = async function () {
    const tecnicoBuscado = document.getElementById('filtroTecnicoNombre').value.trim().toUpperCase();
    const unidadBuscada = document.getElementById('filtroUnidadEco').value.trim().toUpperCase();
    const fechaInicioVal = document.getElementById('filtroFechaInicio').value;
    const fechaFinVal = document.getElementById('filtroFechaFin').value;

    if (!tecnicoBuscado && !unidadBuscada && !fechaInicioVal && !fechaFinVal) {
        if (!confirm("No has escrito ningún filtro. ¿Deseas consultar el acumulado TOTAL de todo el historial?")) {
            return;
        }
    }

    let tInicio = 0;
    if (fechaInicioVal) {
        const [y, m, d] = fechaInicioVal.split('-').map(Number);
        tInicio = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
    }

    let tFin = Date.now();
    if (fechaFinVal) {
        const [y, m, d] = fechaFinVal.split('-').map(Number);
        tFin = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
    }

    const { collection, getDocs, query, orderBy } = window.dbFuncs;
    const btnBuscar = document.getElementById('btnGenerarReporte');

    try {
        btnBuscar.innerText = "⏳ CONSULTANDO...";
        btnBuscar.disabled = true;

        const q = query(collection(window.db, "vales"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        let totalVales = 0;
        let totalPiezasCount = 0;
        let resumenItems = {};
        let equiposAtendidos = new Set();
        let tecnicosInvolucrados = new Set();

        snapshot.forEach(docSnap => {
            const v = docSnap.data();
            const tec = (v.tecnico || "").toUpperCase();
            const eco = (v.equipo && v.equipo.economico) ? v.equipo.economico.toUpperCase() : "";

            let ts = 0;
            if (typeof v.timestamp === 'number') {
                ts = v.timestamp;
            } else if (v.timestamp && typeof v.timestamp.toMillis === 'function') {
                ts = v.timestamp.toMillis();
            } else if (v.timestamp && v.timestamp.seconds) {
                ts = v.timestamp.seconds * 1000;
            } else if (typeof v.timestamp === 'string') {
                ts = new Date(v.timestamp).getTime();
            }

            const cumpleTecnico = !tecnicoBuscado || tec.includes(tecnicoBuscado);
            const cumpleUnidad = !unidadBuscada || eco.includes(unidadBuscada);
            const cumpleFechaInicio = !fechaInicioVal || ts >= tInicio;
            const cumpleFechaFin = !fechaFinVal || ts <= tFin;

            if (cumpleTecnico && cumpleUnidad && cumpleFechaInicio && cumpleFechaFin) {
                totalVales++;
                if (eco) equiposAtendidos.add(eco);
                if (tec) tecnicosInvolucrados.add(tec);

                if (v.items && Array.isArray(v.items)) {
                    v.items.forEach(item => {
                        const cant = parseFloat(item.cant) || 0;
                        const desc = normalizarConcepto(item.desc || "SIN DESCRIPCIÓN");
                        const code = (item.code || "S/C").toUpperCase().trim();
                        const key = `${code}___${desc}`;

                        totalPiezasCount += cant;

                        if (!resumenItems[key]) {
                            resumenItems[key] = { code, desc, totalCant: 0 };
                        }
                        resumenItems[key].totalCant += cant;
                    });
                }
            }
        });

        document.getElementById('statTotalVales').innerText = totalVales;
        document.getElementById('statTotalPiezas').innerText = totalPiezasCount;
        document.getElementById('statTecnicos').innerText = Array.from(tecnicosInvolucrados).join(', ') || 'Sin especificar';
        document.getElementById('statEquipos').innerText = Array.from(equiposAtendidos).join(', ') || 'Sin especificar';

        const tbody = document.getElementById('tablaResumenBody');
        tbody.innerHTML = "";

        const listaOrdenada = Object.values(resumenItems).sort((a, b) => b.totalCant - a.totalCant);

        if (listaOrdenada.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:15px; color:#888;">No se encontraron registros que coincidan con los filtros.</td></tr>`;
        } else {
            listaOrdenada.forEach(item => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = "1px solid var(--border-color)";
                tr.innerHTML = `
                    <td style="padding:8px; font-weight:bold;">${item.code}</td>
                    <td style="padding:8px;">${item.desc}</td>
                    <td style="padding:8px; text-align:center; font-weight:bold; color:#a4c639;">${item.totalCant}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        document.getElementById('resultadoResumen').style.display = 'block';
        btnBuscar.innerText = "🔍 GENERAR REPORTE";
        btnBuscar.disabled = false;

    } catch (e) {
        console.error("Error al generar resumen:", e);
        window.mostrarToast("Error al procesar la información: " + e.message, "error");
        btnBuscar.innerText = "🔍 GENERAR REPORTE";
        btnBuscar.disabled = false;
    }
};

let formularioModificado = false;

window.evaluarEstadoFormulario = function () {
    const camposPrincipales = ['tecnicoNombre', 'supervisorNombre', 'equipoMarca', 'equipoEco', 'equipoSerie'];
    const tieneCamposLlenos = camposPrincipales.some(id => {
        const el = document.getElementById(id);
        return el && el.value.trim() !== "";
    });

    const notesArea = document.getElementById('notesArea');
    const tieneNotas = notesArea && notesArea.innerText.trim() !== "";

    const filas = document.querySelectorAll('#itemsBody tr');
    let tieneRefacciones = false;

    filas.forEach(tr => {
        const desc = tr.querySelector('.desc-field')?.value?.trim() || "";
        const code = tr.querySelector('.code-field')?.value?.trim() || "";
        const cant = tr.querySelector('.cant-field')?.value?.trim() || "1";

        if (desc !== "" || code !== "" || (cant !== "1" && cant !== "")) {
            tieneRefacciones = true;
        }
    });

    formularioModificado = tieneCamposLlenos || tieneNotas || tieneRefacciones;
    actualizarEstadoNavegacion(formularioModificado);
};

window.marcarFormularioComoLimpio = function () {
    formularioModificado = false;
    actualizarEstadoNavegacion(false);
};

function actualizarEstadoNavegacion(bloqueado) {
    const enlacesNav = document.querySelectorAll('.tarjeta-nav');
    enlacesNav.forEach(link => {
        if (bloqueado) {
            link.classList.add('nav-bloqueada');
        } else {
            link.classList.remove('nav-bloqueada');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        ['input', 'keyup', 'change'].forEach(evento => {
            appContainer.addEventListener(evento, (e) => {
                if (e.target.id === 'busquedaEco' || e.target.id.startsWith('filtro') || e.target.id.startsWith('input')) return;
                window.evaluarEstadoFormulario();
            });
        });
    }

    document.querySelectorAll('.tarjeta-nav').forEach(link => {
        link.addEventListener('click', (e) => {
            if (formularioModificado) {
                e.preventDefault();
                window.mostrarToast("⚠️ Tienes datos ingresados sin guardar. Guarda o limpia primero.", "advertencia");
            }
        });
    });

    window.addEventListener('beforeunload', (e) => {
        if (formularioModificado) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});

window.mostrarToast = function (mensaje, tipo = 'exito') {
    if (typeof window.vibrar === 'function') window.vibrar(tipo);

    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'no-print';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<span>${mensaje}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

window.toggleTema = function () {
    const temaActual = document.documentElement.getAttribute('data-theme') || 'light';
    const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', nuevoTema);
    localStorage.setItem('somsi_tema', nuevoTema);
    actualizarTextoBotonTema(nuevoTema);
};

function actualizarTextoBotonTema(tema) {
    const btns = document.querySelectorAll('.btn-theme-toggle');
    btns.forEach(btn => {
        if (btn.innerText.includes('Modo')) {
            btn.innerText = tema === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const temaGuardado = localStorage.getItem('somsi_tema') || 'light';
    document.documentElement.setAttribute('data-theme', temaGuardado);
    actualizarTextoBotonTema(temaGuardado);
});

window.vibrar = function (tipo = 'clic') {
    if (!('navigator' in window) || !('vibrate' in navigator)) return;

    switch (tipo) {
        case 'exito': navigator.vibrate([80, 40, 80]); break;
        case 'error': navigator.vibrate([150, 50, 150, 50, 200]); break;
        case 'advertencia': navigator.vibrate([120, 60, 120]); break;
        case 'clic': default: navigator.vibrate(40); break;
    }
};

/* --- MÓDULO DE HOMOLOGACIÓN Y NIP --- */
window.abrirGestorHomologacion = function () {
    const pinIngresado = prompt("🔒 Ingresa la clave de administración para gestionar conceptos:");
    if (pinIngresado === null) return;
    if (pinIngresado !== OBTENER_PIN_ALMACEN()) {
        window.mostrarToast("❌ Clave incorrecta. Acceso denegado.", "error");
        return;
    }
    
    const modal = document.getElementById("modalHomologacion");
    if (modal) {
        modal.classList.add("active");
        window.renderizarListaSinonimos();
    }
};

window.cerrarGestorHomologacion = function () {
    const modal = document.getElementById("modalHomologacion");
    if (modal) modal.classList.remove("active");
};

window.guardarSinonimo = function () {
    const inputSin = document.getElementById("inputSinonimo");
    const inputOfi = document.getElementById("inputOficial");
    if (!inputSin || !inputOfi) return;

    const original = inputSin.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const oficial = inputOfi.value.trim().toUpperCase();

    if (!original || !oficial) {
        window.mostrarToast("⚠️ Llene ambos campos para guardar la equivalencia.", "advertencia");
        return;
    }

    const dict = OBTENER_DICCIONARIO();
    dict[original] = oficial;
    localStorage.setItem("somsi_diccionario", JSON.stringify(dict));

    inputSin.value = "";
    inputOfi.value = "";
    
    window.mostrarToast("✅ Equivalencia guardada correctamente.", "exito");
    window.renderizarListaSinonimos();
};

window.eliminarSinonimo = function (clave) {
    const dict = OBTENER_DICCIONARIO();
    delete dict[clave];
    localStorage.setItem("somsi_diccionario", JSON.stringify(dict));
    window.renderizarListaSinonimos();
};

window.renderizarListaSinonimos = function () {
    const dict = OBTENER_DICCIONARIO();
    const contenedor = document.getElementById("listaSinonimosBody");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const claves = Object.keys(dict);
    if (claves.length === 0) {
        contenedor.innerHTML = "<tr><td colspan='3' style='text-align:center; padding:10px; color:#888;'>No hay sinónimos registrados.</td></tr>";
        return;
    }

    claves.forEach(clave => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="padding:6px 10px;"><b>${clave}</b></td>
            <td style="padding:6px 10px;">➡️ ${dict[clave]}</td>
            <td style="padding:6px 10px; text-align:center;">
                <button class="btn-del-mini" onclick="eliminarSinonimo('${clave}')">🗑️</button>
            </td>
        `;
        contenedor.appendChild(tr);
    });
};

window.cambiarPinAlmacen = function () {
    const nuevoPin = prompt("🔑 Ingresa el nuevo NIP de administración (mínimo 4 dígitos):");
    if (nuevoPin && nuevoPin.trim().length >= 4) {
        localStorage.setItem("somsi_pin_almacen", nuevoPin.trim());
        window.mostrarToast("🔐 Clave actualizada con éxito.", "exito");
    } else if (nuevoPin !== null) {
        window.mostrarToast("⚠️ El NIP debe tener al menos 4 dígitos.", "advertencia");
    }
};

/* --- EXPORTACIÓN FILTRADA A EXCEL CON HOMOLOGACIÓN --- */
window.exportarExcelHistorial = function () {
    if (!window.historialLocal || window.historialLocal.length === 0) {
        window.mostrarToast("⚠️ No hay datos cargados en el historial.", "advertencia");
        return;
    }

    const filtroInput = document.getElementById("busquedaEco");
    const filtro = filtroInput ? filtroInput.value.trim().toLowerCase() : "";
    
    const registrosFiltrados = window.historialLocal.filter(vale => {
        if (!filtro) return true;
        const eco = (vale.equipo?.economico || "").toLowerCase();
        const folio = (vale.folio || "").toString().toLowerCase();
        const tec = (vale.tecnico || "").toLowerCase();
        return eco.includes(filtro) || folio.includes(filtro) || tec.includes(filtro);
    });

    if (registrosFiltrados.length === 0) {
        window.mostrarToast("⚠️ No hay registros que coincidan con la búsqueda.", "advertencia");
        return;
    }

    const filasExcel = [];

    registrosFiltrados.forEach(vale => {
        const fechaHora = vale.timestamp ? new Date(vale.timestamp).toLocaleString('es-MX') : "";
        
        if (vale.items && vale.items.length > 0) {
            vale.items.forEach(item => {
                filasExcel.push({
                    "Folio": vale.folio || "S/N",
                    "Fecha": fechaHora,
                    "Económico / Equipo": vale.equipo?.economico || "",
                    "Marca": vale.equipo?.marca || "",
                    "Serie": vale.equipo?.serie || "",
                    "Técnico": vale.tecnico || "",
                    "Supervisor / Autoriza": vale.supervisor || "",
                    "Cantidad": item.cant || 1,
                    "Concepto Homologado": normalizarConcepto(item.desc),
                    "Concepto Original": item.desc || "",
                    "Código / Parte": item.code || "",
                    "Notas": vale.notas || ""
                });
            });
        } else {
            filasExcel.push({
                "Folio": vale.folio || "S/N",
                "Fecha": fechaHora,
                "Económico / Equipo": vale.equipo?.economico || "",
                "Marca": vale.equipo?.marca || "",
                "Serie": vale.equipo?.serie || "",
                "Técnico": vale.tecnico || "",
                "Supervisor / Autoriza": vale.supervisor || "",
                "Cantidad": 0,
                "Concepto Homologado": "SIN ITEMS",
                "Concepto Original": "",
                "Código / Parte": "",
                "Notas": vale.notas || ""
            });
        }
    });

    const hoja = XLSX.utils.json_to_sheet(filasExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Historial_Filtrado");

    const fechaHoy = new Date().toISOString().split('T')[0];
    XLSX.writeFile(libro, `Reporte_Vales_SOMSI_${fechaHoy}.xlsx`);

    window.mostrarToast("📊 Reporte Excel generado exitosamente.", "exito");
};