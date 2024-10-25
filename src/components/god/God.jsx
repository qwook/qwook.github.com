// I am translating Terry Davis's "talk to god" code into javascript.

// :: TempleOS/Kernel/KDataTypes.HC

class CFifoU8 {
  buf;
  mask;
  in_ptr;
  out_ptr;

  constructor(size) {
    this.buf = new Array(size).fill(0); // Memory allocation for the buffer
    this.mask = size - 1; // Mask to handle circular buffer wrap-around
  }
}

// CFifoU8 *FifoU8New(I64 size,CTask *mem_task=NULL)
// {//Create new fifo.
//   CFifoU8 *f;
//   if (!mem_task) mem_task=Fs;
//   f=MAlloc(sizeof(CFifoU8),mem_task);
//   f->buf=MAlloc(size,mem_task);
//   f->mask=size-1;
//   f->in_ptr=0;
//   f->out_ptr=0;
//   return f;
// }

// Create a new FIFO with specified size
function FifoU8New(size) {
  return new CFifoU8(size);
}

// U0 FifoU8Del(CFifoU8 *f)
// {//Free fifo.
//   Free(f->buf);
//   Free(f);
// }

// Delete the FIFO (free memory)
function FifoU8Del(f) {
  f.buf = null; // In JavaScript, we don't need to explicitly free memory, but nullifying ensures it can be garbage collected
  f = null;
}

// Bool FifoU8Ins(CFifoU8 *f,U8 b)
// {//Insert U8 into fifo.
//   I64 new_in_ptr;
//   PUSHFD
//   CLI
//   new_in_ptr=(f->in_ptr+1)&f->mask;
//   if (new_in_ptr==f->out_ptr) {
//     POPFD
//     return FALSE;
//   } else {
//     f->buf[f->in_ptr]=b;
//     f->in_ptr=new_in_ptr;
//     POPFD
//     return TRUE;
//   }
// }

// Insert U8 into FIFO
function FifoU8Ins(f, b) {
  const new_in_ptr = (f.in_ptr + 1) & f.mask;
  if (new_in_ptr === f.out_ptr) {
    return false; // FIFO is full
  } else {
    f.buf[f.in_ptr] = b;
    f.in_ptr = new_in_ptr;
    return true;
  }
}

// Bool FifoU8Rem(CFifoU8 *f,U8 *_b)
// {//Remove U8 from fifo.
//   PUSHFD
//   CLI
//   if (f->in_ptr==f->out_ptr) {
//     POPFD
//     return FALSE;
//   } else {
//     *_b=f->buf[f->out_ptr];
//     f->out_ptr=(f->out_ptr+1)&f->mask;
//     POPFD
//     return TRUE;
//   }
// }

// Remove U8 from FIFO
function FifoU8Rem(f, _b) {
  if (f.in_ptr === f.out_ptr) {
    return false; // FIFO is empty
  } else {
    _b[0] = f.buf[f.out_ptr];
    f.out_ptr = (f.out_ptr + 1) & f.mask;
    return true;
  }
}

// Bool FifoU8Peek(CFifoU8 *f,U8 *_b)
// {//Peek at front of fifo and don't remove.
//   PUSHFD
//   CLI
//   if (f->in_ptr==f->out_ptr) {
//     POPFD
//     return FALSE;
//   } else {
//     *_b=f->buf[f->out_ptr];
//     POPFD
//     return TRUE;
//   }
// }

// Peek at the front of the FIFO without removing the element
function FifoU8Peek(f, _b) {
  if (f.in_ptr === f.out_ptr) {
    return false; // FIFO is empty
  } else {
    _b[0] = f.buf[f.out_ptr];
    return true;
  }
}

// :: TempleOS/Adam/God/GodExt.HC

// #define GOD_BAD_BITS	4
// #define GOD_GOOD_BITS	24

const GOD_BAD_BITS = 4;
const GOD_GOOD_BITS = 24;

// public class CGodGlbls
// {
//   U8	**words,
// 	*word_file_mask;
//   I64	word_fuf_flags,
// 	num_words;
//   CFifoU8 *fifo;
//   CDC	*doodle_dc;
//   I64	doodle_ch;
//   CFifoU8 *doodle_fifo;
//   Bool	doodle_done;
// } god;
// MemSet(&god,0,sizeof(CGodGlbls));
// god.doodle_fifo	=FifoU8New(2048*8);
// god.fifo	=FifoU8New(2048*8);

class CGodGlbls {
  words = [];
  word_file_mask = null;
  word_fuf_flags = 0;
  num_words = 0;
  fifo = FifoU8New(2048 * 8); // Initialize FIFO with the same size as in the original
  doodle_fifo = FifoU8New(2048 * 8); // Same size for doodle FIFO
  doodle_dc = null;
  doodle_ch = 0;
  doodle_done = false; // Boolean indicating whether the "doodle" is done
}

const god = new CGodGlbls();

// #define GOD_BAD_BITS	4
// #define GOD_GOOD_BITS	24

// // Lookup table to reverse the bits of a 4-bit number
// const uint8_t rev_bits_table[16] = {
//   0x0, // 0000 -> 0000
//   0x8, // 0001 -> 1000
//   0x4, // 0010 -> 0100
//   0xC, // 0011 -> 1100
//   0x2, // 0100 -> 0010
//   0xA, // 0101 -> 1010
//   0x6, // 0110 -> 0110
//   0xE, // 0111 -> 1110
//   0x1, // 1000 -> 0001
//   0x9, // 1001 -> 1001
//   0x5, // 1010 -> 0101
//   0xD, // 1011 -> 1101
//   0x3, // 1100 -> 0011
//   0xB, // 1101 -> 1011
//   0x7, // 1110 -> 0111
//   0xF  // 1111 -> 1111
// };

// Lookup table to reverse the bits of a 4-bit number
const rev_bits_table = [
  0x0, 0x8, 0x4, 0xc, 0x2, 0xa, 0x6, 0xe, 0x1, 0x9, 0x5, 0xd, 0x3, 0xb, 0x7,
  0xf,
];

// KbdMsEvtTime is the last keyboard or mouse event.

// Leave PopUpTimerOk implementation empty.
// I64 PopUpTimerOk(U8 *header=NULL,U8 *footer=NULL)
// {
//   I64 i;
//   CDocEntry *doc_e;
//   CDoc *doc=DocNew;
//   if (header) DocPrint(doc,"%s",header);
//   doc_e=DocPrint(doc,"\nTimer:$$TX+TC,\" \"$$");
//   doc_e->tag_cb=&TimeStampCB;
//   doc_e=DocPrint(doc,"\nLatch:$$TX+TC,\" \"$$");
//   doc_e->tag_cb=&KbdMsTimeCB;
//   DocPrint(doc,"\n$$CM+CX,0,4$$$$BT,\"OKAY\",LE=1$$\n");
//   if (footer) DocPrint(doc,"%s",footer);
//   i=PopUpMenu(doc);
//   DocDel(doc);
//   return i;
// }

let KbdMsEvtTime = Date.now(); // Timestamp of the last keyboard or mouse event

// This simulates capturing the latest user event.
document.body.addEventListener("keydown", () => {
  KbdMsEvtTime = Date.now();
});

document.body.addEventListener("mousemove", () => {
  KbdMsEvtTime = Date.now();
});

function PopUpTimerOk(header, footer) {
  // Empty implementation
  return 0;
}

// I64 GodPick(U8 *msg=NULL)
// {//GOD_GOOD_BITS
//   U8 *st=MStrPrint("%s\n\nPress $$GREEN$$OKAY$$FG$$ to generate \n"
// 	"a random num from a timer.\n",msg);
//   PopUpTimerOk(st,"\n\nThe $LK+PU,"Holy Spirit",A="FI:::/Adam/God/HSNotes.DD"$ can puppet you.\n\n");
//   Free(st);
//   return KbdMsEvtTime>>GOD_BAD_BITS;
// }

function GodPick(msg = null) {
  const st = `${msg}\n\nPress OKAY to generate a random number from a timer.\n`;
  PopUpTimerOk(st, "\n\nThe Holy Spirit can puppet you.\n\n");
  return KbdMsEvtTime >> GOD_BAD_BITS; // Right-shift to remove less significant bits
}

// public U0 GodBitsIns(I64 num_bits,I64 n)
// {//Insert bits into God bit fifo.
//   I64 i;
//   for (i=0;i<num_bits;i++) {
//     FifoU8Ins(god.fifo,n&1);
//     n>>=1;
//   }
// }

function GodBitsIns(num_bits, n) {
  for (let i = 0; i < num_bits; i++) {
    FifoU8Ins(god.fifo, n & 1); // Insert each bit into the FIFO
    n >>= 1; // Shift right to process the next bit
  }
}

// public I64 GodBits(I64 num_bits,U8 *msg=NULL)
// {//Return N bits. If low on entropy pop-up okay.
//   U8 b;
//   I64 res=0;
//   while (num_bits) {
//     if (FifoU8Rem(god.fifo,&b)) {
//       res=res<<1+b;
//       num_bits--;
//     } else
//       GodBitsIns(GOD_GOOD_BITS,GodPick(msg));
//   }
//   return res;
// }

function GodBits(num_bits, msg = null) {
  let res = 0;
  let b = [0];

  while (num_bits > 0) {
    if (FifoU8Rem(god.fifo, b)) {
      res = (res << 1) + b[0]; // Accumulate bits into result
      num_bits--;
    } else {
      GodBitsIns(GOD_GOOD_BITS, GodPick(msg)); // Refill FIFO if empty
    }
  }

  return res;
}

// public I64 GodInit(U8 *files_find_mask="/Adam/God/Vocab.DD*",U8 *fu_flags=NULL)
// {//Read God's vocab file for picking words.
//   I64 i,ch,fuf_flags=0;
//   U8 *buf,*ptr,*ptr2;
//   CDirEntry *tmpde,*tmpde1;
//   ScanFlags(&fuf_flags,Define("ST_FILE_UTIL_FLAGS"),"+r+f+F+T+O");
//   ScanFlags(&fuf_flags,Define("ST_FILE_UTIL_FLAGS"),fu_flags);
//   if (fuf_flags&~FUG_FILES_FIND)
//     throw('FUF');

//   Free(god.word_file_mask);
//   god.word_file_mask=StrNew(files_find_mask);
//   god.word_fuf_flags=fuf_flags;

//   tmpde=tmpde1=FilesFind(files_find_mask,fuf_flags);
//   i=0;
//   while (tmpde) {
//     if (buf=ptr=FileRead(tmpde->full_name)) {
//       while (*ptr) {
// 	while (*ptr && !Bt(char_bmp_word,*ptr))
// 	  ptr++;
// 	if (*ptr) {
// 	  ptr2=ptr;
// 	  while (*ptr && Bt(char_bmp_word,*ptr))
// 	    ptr++;
// 	  i++;
// 	}
//       }
//       Free(buf);
//     }
//     tmpde=tmpde->next;
//   }

//   Free(god.words);
//   god.num_words=i;
//   god.words=MAlloc(i*sizeof(U8 *));

//   tmpde=tmpde1;
//   i=0;
//   while (tmpde) {
//     if (buf=ptr=FileRead(tmpde->full_name)) {
//       while (*ptr) {
// 	while (*ptr && !Bt(char_bmp_word,*ptr))
// 	  ptr++;
// 	if (*ptr) {
// 	  ptr2=ptr;
// 	  while (*ptr && Bt(char_bmp_word,*ptr))
// 	    ptr++;
// 	  ch=*ptr;
// 	  *ptr=0;
// 	  god.words[i++]=StrNew(ptr2);
// 	  *ptr=ch;
// 	}
//       }
//       Free(buf);
//     }
//     tmpde=tmpde->next;
//   }
//   DirTreeDel(tmpde1);
//   return god.num_words;
// } GodInit;

function GodInit() {
  // No file-reading in Javascript, just import it instead.
  const wordsText = require("./vocab.txt");
  const words = wordsText.split("\n");
  god.words = words;
  god.num_words = words.length;
}

// public U8 *GodWordStr(I64 bits=17)
// {//Make God pick a word. $LK+PU,"Holy Spirit Instructions",A="FI:::/Adam/God/HSNotes.DD"$
//   if (god.num_words)
//     return god.words[GodBits(bits)%god.num_words];
//   else
//     return NULL;
// }

// public U0 GodWord(I64 bits=17)
// {//Make God pick a word. $LK+PU,"Holy Spirit Instructions",A="FI:::/Adam/God/HSNotes.DD"$
//   if (god.num_words)
//     "%s ",god.words[GodBits(bits)%god.num_words];
// }

export function GodWordStr(bits = 17) {
  if (god.num_words > 0) {
    return god.words[GodBits(bits) % god.num_words];
  } else {
    return null;
  }
}

export function GodWord(bits = 17) {
  if (god.num_words > 0) {
    console.log(`${god.words[GodBits(bits) % god.num_words]} `);
  }
}

// public U0 GodBiblePassage(I64 num_lines=20)
// {//Make God pick a Bible passage. $LK+PU,"Holy Spirit Instructions",A="FI:::/Adam/God/HSNotes.DD"$
//   I64 start=GodBits(21)%(ST_BIBLE_LINES-(num_lines-1))+1;
//   U8 *verse=BibleLine2Verse(start);
//   "%s\n\n",verse;
//   Free(verse);
//   BookLines(,start,num_lines);
// }

GodInit();

export function GetNextGodWord() {
  GodBitsIns(GOD_GOOD_BITS, KbdMsEvtTime >> GOD_BAD_BITS);
  return GodWordStr();
}
