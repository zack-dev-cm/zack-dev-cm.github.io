export const CHAPTER_SECONDS=8;
export const LANGUAGE=typeof location!=='undefined'&&new URLSearchParams(location.search).get('lang')==='ru'?'ru':'en';
export const translate=(en,ru)=>LANGUAGE==='ru'?ru:en;
const english=[
  {id:'drawing',label:'Read the drawing',title:'Find the cabinet in your drawing.',copy:'The highlighted label identifies the cabinet. Keep the drawing page with it so you can check the original.',action:'Find the cabinet label'},
  {id:'extract',label:'Identify the cabinet',title:'Keep the code and its source.',copy:'The code connects this cabinet to its drawing. Confirm the quantity to order from the drawing and installation site.',action:'Keep the code, page and quantity check'},
  {id:'match',label:'Check the catalog',title:'Choose the matching cabinet.',copy:'Compare the two catalog options: B3000 has one upper drawer; B3100 has two. The doors and shelf stay the same.',action:'Compare one drawer with two'},
  {id:'inspect',label:'Look inside',title:'See how the cabinet opens.',copy:'Open the drawers and doors, then look at the shelf inside. Compare the storage before choosing a cabinet.',action:'Open the drawers and doors, then inspect the shelf'},
  {id:'review',label:'Check the size',title:'Check the cabinet dimensions.',copy:'Compare the catalog size with the space in your room. Confirm measurements, quantity, finish and price before ordering.',action:'Compare the cabinet size with your space'},
  {id:'render',label:'Preview the look',title:'See the cabinet in warm oak.',copy:'This room preview shows a 36-inch oak cabinet. Explore the look before planning the room around it.',action:'Preview the oak finish in a room'},
  {id:'room',label:'Place it in the room',title:'Fit it between the other cabinets.',copy:'The cabinet lines up with its neighbours and slides beneath the shared worktop. The opening must be wide enough.',action:'Align the cabinet and slide it into place'},
  {id:'result',label:'Explore the result',title:'See the whole room come together.',copy:'Explore the fitted cabinet, worktable, seating and garden view. Keep the drawing, fit notes and item list for your next step.',action:'Explore the room and keep the project files'},
];
const russian=[
  {id:'drawing',label:'Читаем чертёж',title:'Находим тумбу на чертеже.',copy:'Подсвеченная отметка указывает на нужную тумбу. Сохраняем страницу, чтобы можно было свериться с оригиналом.',action:'Находим обозначение тумбы'},
  {id:'extract',label:'Определяем модель',title:'Сохраняем код и страницу.',copy:'Код связывает тумбу с чертежом и помогает найти её в каталоге. Количество тумб для заказа уточняем по чертежу и на месте установки.',action:'Сохраняем код и уточняем количество'},
  {id:'match',label:'Сверяем с каталогом',title:'Выбираем подходящую тумбу.',copy:'Сравниваем варианты: у B3000 один верхний ящик, у B3100 — два. Дверцы и полка у них одинаковые.',action:'Сравниваем модели с одним и двумя ящиками'},
  {id:'inspect',label:'Устройство тумбы',title:'Открываем ящики и дверцы.',copy:'Изучаем полку и место для хранения. Сравниваем устройство двух моделей, чтобы выбрать удобную тумбу.',action:'Открываем ящики и дверцы, изучаем полку'},
  {id:'review',label:'Проверяем размеры',title:'Сверяем размеры для установки.',copy:'Сверяем габариты тумбы с размерами места установки. Перед заказом уточняем замеры, количество, отделку и цену.',action:'Сверяем габариты тумбы с размерами места установки'},
  {id:'render',label:'Вид в интерьере',title:'Оцениваем дубовую отделку.',copy:'В этом интерьере — дубовая тумба шириной 914,4 мм. Оцениваем цвет, фактуру и пропорции для будущего интерьера.',action:'Оцениваем дубовую отделку в интерьере'},
  {id:'room',label:'Размещение в комнате',title:'Тумба встаёт на своё место.',copy:'Тумба выравнивается с соседними модулями и встаёт под общую столешницу. Ширину проёма сверяем с размерами выбранной модели.',action:'Выравниваем тумбу и ставим на место'},
  {id:'result',label:'Смотрим результат',title:'Осматриваем готовую комнату.',copy:'Тумба на месте, рядом стол и стулья, за окном — сад. Сохраняем чертёж, замечания по размерам и список мебели.',action:'Осматриваем комнату и сохраняем материалы'},
];
export const chaptersFor=(language='en')=>(language==='ru'?russian:english).map((c,i)=>({...c,start:i*CHAPTER_SECONDS,end:(i+1)*CHAPTER_SECONDS}));
export const CHAPTERS=chaptersFor(LANGUAGE);
export const DURATION=CHAPTERS.length*CHAPTER_SECONDS;
export const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
export function chapterAt(t){return Math.min(CHAPTERS.length-1,Math.floor(Math.max(0,t)/CHAPTER_SECONDS));}
export function chapterText(index,width=36,code='B3000'){
  const c=CHAPTERS[index],dp=code==='B3000'?1:3,mm=(width*25.4).toFixed(1).replace('.',LANGUAGE==='ru'?',':'.');
  const source={
    drawing:translate(`Drawing · page ${dp}\n${code} base cabinet`,`Чертёж · страница ${dp}\nНапольная тумба ${code}`),
    extract:translate(`${code} · 3 labels found\nConfirm the number to order`,`${code} · найдено 3 отметки\nУточните количество для заказа`),
    match:translate('B3000 · one drawer · catalog p. 27\nB3100 · two drawers · catalog p. 28','B3000 · один ящик · каталог, стр. 27\nB3100 · два ящика · каталог, стр. 28'),
    inspect:translate('Two doors · one adjustable shelf\nCatalog pages 27 and 28','Две дверцы · одна регулируемая полка\nСтраницы каталога 27 и 28'),
    review:translate(`${mm} mm wide · 863.6 mm high\n609.6 mm deep · catalog size`,`${mm} мм ширина · 863,6 мм высота\n609,6 мм глубина · размеры из каталога`),
    render:translate(`${code} · oak finish preview\n36-inch cabinet · 914.4 mm wide`,`${code} · пример дубовой отделки\nШирина тумбы — 914,4 мм`),
    room:translate(`${code} · ${mm} mm wide\nExample layout · check your room`,`${code} · ширина ${mm} мм\nПример расстановки · проверьте замеры`),
    result:translate('Drawing · fit notes · room preview\nConfirm quantity and price before ordering','Чертёж · размеры · вид комнаты\nПеред заказом уточните количество и цену'),
  }[c.id];
  return {...c,source};
}
export function poseAt(t){
  const chapter=chapterAt(t),progress=Math.max(0,Math.min(1,(t-CHAPTERS[chapter].start)/CHAPTER_SECONDS)),p=smooth(progress),id=CHAPTERS[chapter].id;
  const inspect=id==='inspect',review=id==='review';
  return {chapter,progress,opening:inspect?smooth(progress/.48):review?1-smooth(progress/.26):0,separate:inspect?.68*smooth((progress-.35)/.5):0,dimensions:review&&progress>=.26,blueprint:false,camera:inspect?[1.5-p*.7,1.5,4.4]:review?[1.3+p*.5,1.55,4.6]:[2.2,1.45,4]};
}
