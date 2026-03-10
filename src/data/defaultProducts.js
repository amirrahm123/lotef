export const CATEGORIES = [
  'הכל',
  'תרופות ללא מרשם',
  'ויטמינים ותוספים',
  'טיפוח ויופי',
  'ציוד רפואי',
  'תינוקות וילדים',
  'היגיינה',
]

export const defaultProducts = [
  // תרופות ללא מרשם
  { id: 1,  name: 'אקמול 500 מ"ג',       category: 'תרופות ללא מרשם', description: 'משכך כאבים ומוריד חום, 20 טבליות',         icon: '💊', available: true },
  { id: 2,  name: 'נורופן 200 מ"ג',       category: 'תרופות ללא מרשם', description: 'נוגד דלקת ומשכך כאבים, 20 טבליות',       icon: '💊', available: true },
  { id: 3,  name: 'אופטלגין טיפות',       category: 'תרופות ללא מרשם', description: 'טיפות למבוגרים, 20 מ"ל',                  icon: '💧', available: true },
  { id: 4,  name: 'דקסמול קידס',          category: 'תרופות ללא מרשם', description: 'סירופ להורדת חום לילדים, 100 מ"ל',        icon: '🍼', available: true },
  { id: 5,  name: 'סטופר שלשולים',        category: 'תרופות ללא מרשם', description: 'קפסולות נגד שלשולים, 8 קפסולות',          icon: '💊', available: true },
  { id: 6,  name: 'רנני אנטאסיד',         category: 'תרופות ללא מרשם', description: 'לטיפול בצרבת, 24 טבליות לעיסה',           icon: '🟢', available: true },

  // ויטמינים ותוספים
  { id: 7,  name: 'ויטמין C 1000',        category: 'ויטמינים ותוספים', description: 'תוסף ויטמין C, 30 כמוסות',                icon: '🍊', available: true },
  { id: 8,  name: 'ויטמין D3 1000',       category: 'ויטמינים ותוספים', description: 'ויטמין D לחיזוק העצמות, 60 כמוסות',       icon: '☀️', available: true },
  { id: 9,  name: 'אומגה 3',              category: 'ויטמינים ותוספים', description: 'שמן דגים, 90 כמוסות רכות',                icon: '🐟', available: true },
  { id: 10, name: 'מגנזיום 400',          category: 'ויטמינים ותוספים', description: 'מגנזיום להרפיית שרירים, 60 טבליות',       icon: '✨', available: true },
  { id: 11, name: 'מולטי ויטמין',         category: 'ויטמינים ותוספים', description: 'מולטי ויטמין יומי, 30 טבליות',            icon: '💪', available: true },
  { id: 12, name: 'פרוביוטיקה',           category: 'ויטמינים ותוספים', description: 'תוסף פרוביוטי, 30 כמוסות',               icon: '🦠', available: true },

  // טיפוח ויופי
  { id: 13, name: 'קרם לחות לפנים',       category: 'טיפוח ויופי', description: 'קרם לחות יומי SPF30, 50 מ"ל',                icon: '🧴', available: true },
  { id: 14, name: 'קרם הגנה SPF50',       category: 'טיפוח ויופי', description: 'הגנה מהשמש לכל המשפחה, 200 מ"ל',             icon: '🌞', available: true },
  { id: 15, name: 'שמפו טיפולי',          category: 'טיפוח ויופי', description: 'שמפו נגד קשקשים, 250 מ"ל',                   icon: '🧴', available: true },
  { id: 16, name: 'סבון פנים עדין',       category: 'טיפוח ויופי', description: 'ניקוי עדין לעור רגיש, 150 מ"ל',              icon: '🫧', available: true },

  // ציוד רפואי
  { id: 17, name: 'מד חום דיגיטלי',       category: 'ציוד רפואי', description: 'מד חום מהיר ומדויק',                           icon: '🌡️', available: true },
  { id: 18, name: 'מד לחץ דם',            category: 'ציוד רפואי', description: 'מד לחץ דם אוטומטי לזרוע',                     icon: '❤️', available: true },
  { id: 19, name: 'ערכת עזרה ראשונה',     category: 'ציוד רפואי', description: 'ערכה מלאה לבית, 50 פריטים',                    icon: '🩹', available: true },
  { id: 20, name: 'פלסטרים מגוון',        category: 'ציוד רפואי', description: 'פלסטרים בגדלים שונים, 40 יחידות',             icon: '🩹', available: true },

  // תינוקות וילדים
  { id: 21, name: 'טיטולים מידה 3',       category: 'תינוקות וילדים', description: 'חיתולים לתינוקות 4-9 ק"ג, 50 יחידות',     icon: '👶', available: true },
  { id: 22, name: 'מגבונים לתינוק',       category: 'תינוקות וילדים', description: 'מגבונים לחים עדינים, 72 יחידות',           icon: '🧻', available: true },
  { id: 23, name: 'שמן תינוקות',          category: 'תינוקות וילדים', description: 'שמן עיסוי לתינוק, 200 מ"ל',               icon: '🍼', available: true },

  // היגיינה
  { id: 24, name: 'ג\'ל חיטוי ידיים',     category: 'היגיינה', description: 'ג\'ל אלכוהולי 70%, 250 מ"ל',                     icon: '🧼', available: true },
  { id: 25, name: 'מסכות פנים',           category: 'היגיינה', description: 'מסכות חד פעמיות, 50 יחידות',                      icon: '😷', available: true },
  { id: 26, name: 'משחת שיניים',          category: 'היגיינה', description: 'משחת שיניים עם פלואוריד, 100 מ"ל',                icon: '🦷', available: true },
]
