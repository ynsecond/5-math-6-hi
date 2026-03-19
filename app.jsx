import React, { useState, useRef, useEffect, useCallback } from "react";

/* Fraction Renderer */
const SUP={"⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9"};
const SUB={"₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9"};
function parseFrac(text){
  if(!text)return [text];
  var parts=[],i=0;
  while(i<text.length){
    var whole="",j=i;
    while(j<text.length&&/[0-9]/.test(text[j])){whole+=text[j];j++;}
    var num="";
    while(j<text.length&&SUP[text[j]]!==undefined){num+=SUP[text[j]];j++;}
    if(num&&j<text.length&&text[j]==="⁄"){
      j++;var den="";
      while(j<text.length&&SUB[text[j]]!==undefined){den+=SUB[text[j]];j++;}
      if(den){
        if(whole)parts.push({type:"mixed",whole:whole,num:num,den:den});
        else parts.push({type:"frac",num:num,den:den});
        i=j;continue;
      }
    }
    if(whole){parts.push(whole);i+=whole.length;}
    else{parts.push(text[i]);i++;}
  }
  var m=[];
  for(var k=0;k<parts.length;k++){
    var p=parts[k];
    if(typeof p==="string"&&m.length>0&&typeof m[m.length-1]==="string")m[m.length-1]+=p;
    else m.push(p);
  }
  return m;
}

function FracSpan(props){
  return React.createElement("span",{style:{display:"inline-flex",flexDirection:"column",alignItems:"center",verticalAlign:"middle",margin:"0 1px",lineHeight:1,position:"relative",top:"-1px"}},
    React.createElement("span",{style:{fontSize:"0.78em",lineHeight:1.1,padding:"0 2px"}},props.num),
    React.createElement("span",{style:{width:"100%",height:1.5,background:"currentColor",margin:"1px 0"}}),
    React.createElement("span",{style:{fontSize:"0.78em",lineHeight:1.1,padding:"0 2px"}},props.den)
  );
}

function FracText(props){
  var parts=parseFrac(props.text);
  var children=parts.map(function(p,i){
    if(typeof p==="string")return React.createElement("span",{key:i},p);
    if(p.type==="mixed")return React.createElement("span",{key:i,style:{display:"inline-flex",alignItems:"center"}},
      React.createElement("span",null,p.whole),
      React.createElement(FracSpan,{num:p.num,den:p.den})
    );
    return React.createElement(FracSpan,{key:i,num:p.num,den:p.den});
  });
  return React.createElement("span",{style:props.style},children);
}

function FracBlock(props){
  if(!props.text)return null;
  var lines=props.text.split("\n");
  return React.createElement("div",{style:props.style},
    lines.map(function(l,i){
      return React.createElement("div",{key:i,style:{minHeight:"1.4em"}},
        React.createElement(FracText,{text:l})
      );
    })
  );
}

/* Problem Data */
var P=[
{id:"R1",s:"基本II　類題1",t:"太郎君と次郎君は100円玉を何枚か持っています。太郎君の所持金が500円、次郎君の所持金が300円のとき、次の問いに答えなさい。",sub:[
{q:"(1) 太郎君と次郎君は100円玉をそれぞれ何枚ずつ持っていますか。",a:"太郎君：5枚、次郎君：3枚",h:"100円玉だけだから、金額÷100で枚数がわかるよ♪\n太郎君：500÷100＝5（枚）\n次郎君：300÷100＝3（枚）"},
{q:"(2) 太郎君と次郎君が持っている硬貨の枚数の比を求めなさい。比はかん単にしなくてかまいません。",a:"5：3",h:"太郎君5枚、次郎君3枚だから 5：3 だよ♪"},
{q:"(3) 太郎君と次郎君の所持金の比を求めなさい。",a:"5：3",h:"500：300を100でわると 5：3"}]},
{id:"E1-1",s:"演習1 ［1］",t:"太郎君が80円、次郎君が50円持っています。次の問いに答えなさい。",sub:[
{q:"(1) 2人とも1円玉だけでお金を持っているとき、太郎君と次郎君の持っている硬貨の枚数の比を求めなさい。比はかん単にしなくてかまいません。",a:"80：50",h:"1円玉だけだから80枚と50枚。比は 80：50"},
{q:"(2) 2人とも5円玉だけでお金を持っているとき、太郎君と次郎君の持っている硬貨の枚数の比を求めなさい。比はかん単にしなくてかまいません。",a:"16：10",h:"80÷5＝16枚、50÷5＝10枚 → 16：10"},
{q:"(3) 太郎君と次郎君の所持金の比を答えなさい。",a:"8：5",h:"80：50を10でわると 8：5"}]},
{id:"R2-1",s:"類題2",t:"次の比をできるだけ簡単な整数の比にしなさい。",sub:[{q:"(1)　25：15",a:"5：3",h:"最大公約数5でわる → 5：3"}]},
{id:"R2-2",s:"類題2",t:"次の比をできるだけ簡単な整数の比にしなさい。",sub:[{q:"(2)　252：112",a:"9：4",h:"最大公約数28でわる → 9：4"}]},
{id:"R2-3",s:"類題2",t:"次の比をできるだけ簡単な整数の比にしなさい。",sub:[{q:"(3)　0.72：0.54",a:"4：3",h:"100倍→72：54 最大公約数18→4：3"}]},
{id:"R2-4",s:"類題2",t:"次の比をできるだけ簡単な整数の比にしなさい。",sub:[{q:"(4)　²⁄₅：³⁄₅",a:"2：3",h:"分母が同じ5だから分子だけ見て 2：3"}]},
{id:"R2-5",s:"類題2",t:"次の比をできるだけ簡単な整数の比にしなさい。",sub:[{q:"(5)　³⁄₄：1¹⁄₆",a:"9：14",h:"1¹⁄₆＝⁷⁄₆。分母の最小公倍数12\n⁹⁄₁₂：¹⁴⁄₁₂ → 9：14"}]},
{id:"R2-6",s:"類題2",t:"次の比をできるだけ簡単な整数の比にしなさい。",sub:[{q:"(6)　75cm：1.2m",a:"5：8",h:"1.2m＝120cm → 75：120 ÷15→5：8"}]},
{id:"E2-1-1",s:"演習2 ［1］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(1)　16：12",a:"4：3",h:"最大公約数4 → 4：3"}]},
{id:"E2-1-2",s:"演習2 ［1］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(2)　27：99",a:"3：11",h:"最大公約数9 → 3：11"}]},
{id:"E2-1-3",s:"演習2 ［1］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(3)　105：245",a:"3：7",h:"最大公約数35 → 3：7"}]},
{id:"E2-1-4",s:"演習2 ［1］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(4)　52：91",a:"4：7",h:"最大公約数13 → 4：7"}]},
{id:"E2-2-1",s:"演習2 ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(1)　0.2：0.6",a:"1：3",h:"10倍→2：6 ÷2→1：3"}]},
{id:"E2-2-2",s:"演習2 ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(2)　2：4.5",a:"4：9",h:"2倍して→4：9"}]},
{id:"E2-2-3",s:"演習2 ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(3)　0.63：0.54",a:"7：6",h:"100倍→63：54 ÷9→7：6"}]},
{id:"E2-2-4",s:"演習2 ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(4)　1.25：0.5",a:"5：2",h:"100倍→125：50 ÷25→5：2"}]},
{id:"E2-3-1",s:"演習2 ［3］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(1)　⁵⁄₉：¹⁄₉",a:"5：1",h:"分母同じ9→分子だけ 5：1"}]},
{id:"E2-3-2",s:"演習2 ［3］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(2)　⁵⁄₆：⁴⁄₇",a:"35：24",h:"最小公倍数42→ ³⁵⁄₄₂：²⁴⁄₄₂ → 35：24"}]},
{id:"E2-3-3",s:"演習2 ［3］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(3)　³⁄₂₀：⁸⁄₁₅",a:"9：32",h:"最小公倍数60→ ⁹⁄₆₀：³²⁄₆₀ → 9：32"}]},
{id:"E2-3-4",s:"演習2 ［3］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(4)　0.35：1³⁄₄",a:"1：5",h:"0.35＝⁷⁄₂₀、1³⁄₄＝³⁵⁄₂₀ → 7：35 ÷7→1：5"}]},
{id:"E2-3-5",s:"演習2 ［3］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(5)　1¹⁄₆：2.8",a:"5：12",h:"⁷⁄₆と¹⁴⁄₅→最小公倍数30\n³⁵⁄₃₀：⁸⁴⁄₃₀ → 35：84 ÷7→5：12"}]},
{id:"R3-1",s:"類題3",t:"次の問いに答えなさい。",sub:[{q:"(1) 太郎君は120円持っています。太郎君の所持金と花子さんの所持金の比が3：5のとき、花子さんの所持金は何円ですか。",a:"200円",h:"「3」が120円 → ①＝40円\n花子さん「5」→ 40×5＝200円"}]},
{id:"R3-2",s:"類題3",t:"次の問いに答えなさい。",sub:[{q:"(2) 次郎君のクラスは45人います。次郎君のクラスの男子と女子の人数の比が5：4のとき、次郎君のクラスの男子の人数は何人ですか。",a:"25人",h:"合計9 → ①＝5人 → 男子25人"}]},
{id:"R3-3",s:"類題3",t:"次の問いに答えなさい。",sub:[{q:"(3) 三郎君のクラスは男子の方が女子より6人多いといいます。また、三郎君のクラスの男子の人数と女子の人数の比は7：5です。三郎君のクラスの人数は何人ですか。",a:"36人",h:"差2が6人 → ①＝3人 → 全体12 → 36人"}]},
{id:"E3-1-1",s:"演習3 ［1］",t:"次の問いに答えなさい。",sub:[{q:"(1) 太郎君は1800円持っています。太郎君の所持金と花子さんの所持金の比が6：5のとき、花子さんの所持金は何円ですか。",a:"1500円",h:"「6」が1800円 → ①＝300円 → 花子1500円"}]},
{id:"E3-1-2",s:"演習3 ［1］",t:"次の問いに答えなさい。",sub:[{q:"(2) 次郎君のクラスは32人います。次郎君のクラスの男子の人数と女子の人数の比が7：9のとき、次郎君のクラスの男子の人数は何人ですか。",a:"14人",h:"合計16 → ①＝2人 → 男子14人"}]},
{id:"E3-1-3",s:"演習3 ［1］",t:"次の問いに答えなさい。",sub:[{q:"(3) 三郎君のクラスは男子の方が女子より4人少ないといいます。また、三郎君のクラスの男子の人数と女子の人数の比は9：11です。三郎君のクラスの人数は何人ですか。",a:"40人",h:"差2が4人 → ①＝2人 → 全体20 → 40人"}]},
{id:"E3-2-1",s:"演習3 ［2］",t:"次の問いに答えなさい。",sub:[{q:"(1) 花子さんは小説の本を24冊持っています。また、持っている小説の本とまんがの本の冊数の比は、8：11です。花子さんはまんがの本を何冊持っていますか。",a:"33冊",h:"「8」が24冊 → ①＝3冊 → まんが33冊"}]},
{id:"E3-2-2",s:"演習3 ［2］",t:"次の問いに答えなさい。",sub:[{q:"(2) 60このみかんをひろみさんとくみ子さんが7：5になるように分けます。くみ子さんがもらうみかんは何こになりますか。",a:"25こ",h:"合計12 → ①＝5こ → くみ子25こ"}]},
{id:"E3-2-3",s:"演習3 ［2］",t:"次の問いに答えなさい。",sub:[{q:"(3) たかし君、かずみさん、あきお君の3人が持っているお金の比は7：4：3で、その合計は4200円です。かずみさんが持っているお金はいくらですか。",a:"1200円",h:"合計14 → ①＝300円 → かずみ1200円"}]},
{id:"E3-2-4",s:"演習3 ［2］",t:"次の問いに答えなさい。",sub:[{q:"(4) いくつかのアメをいくみさんとりえ子さんで13：8の割合で分けると、いくみさんのアメの方が20こ多くなりました。アメはいくつありましたか。",a:"84こ",h:"差5が20こ → ①＝4こ → 合計21 → 84こ"}]},
{id:"R4",s:"類題4",t:"",sub:[{q:"A：B＝5：4、B：C＝6：5のとき、A：B：Cの連比を求めなさい。",a:"15：12：10",h:"Bをそろえよう♪ 4と6の最小公倍数12\nA：B→×3→15：12  B：C→×2→12：10\nA：B：C＝15：12：10"}]},
{id:"E4-1",s:"演習4 ［1］",t:"",sub:[{q:"A、B、Cの3人の所持金について、A：B＝9：4、A：C＝36：25であることがわかっています。3人の所持金の合計が15400円のとき、Cの所持金を求めなさい。",a:"5000円",h:"A：B→×4→36：16  A：C＝36：25\nA：B：C＝36：16：25 合計77\n①＝200円 → C＝5000円"}]},
{id:"E4-2-1",s:"演習4 ［2］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(1)　A：B＝4：3、B：C＝3：7",a:"4：3：7",h:"Bがどちらも3！そのまま 4：3：7"}]},
{id:"E4-2-2",s:"演習4 ［2］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(2)　A：B＝2：5、A：C＝8：5",a:"8：20：5",h:"A→×4→8：20 と 8：5 → 8：20：5"}]},
{id:"E4-2-3",s:"演習4 ［2］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(3)　A：C＝12：5、B：C＝3：20",a:"48：3：20",h:"C→×4→48：20 と 3：20 → 48：3：20"}]},
{id:"E4-2-4",s:"演習4 ［2］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(4)　A：B＝2：3、B：C＝9：13",a:"6：9：13",h:"B→×3→6：9 と 9：13 → 6：9：13"}]},
{id:"E4-2-5",s:"演習4 ［2］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(5)　A：B＝5：3、A：C＝7：2",a:"35：21：10",h:"A→5×7＝35 → 35：21 と 35：10"}]},
{id:"E4-2-6",s:"演習4 ［2］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(6)　A：C＝7：2、B：C＝8：3",a:"21：16：6",h:"C→2×3＝6 → 21：6 と 16：6"}]},
{id:"E4-2-7",s:"演習4 ［2］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(7)　A：B＝5：4、B：C＝6：5",a:"15：12：10",h:"B→最小公倍数12 → 15：12：10"}]},
{id:"E4-2-8",s:"演習4 ［2］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(8)　A：B＝8：9、A：C＝6：7",a:"24：27：28",h:"A→最小公倍数24 → 24：27：28"}]},
{id:"E4-2-9",s:"演習4 ［2］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(9)　A：C＝3：28、B：C＝5：42",a:"9：10：84",h:"C→最小公倍数84 → 9：10：84"}]},
{id:"R5-1",s:"類題5",t:"次の比例式のxを求めなさい。",sub:[{q:"(1)　5：6＝15：x",a:"x＝18",h:"5→15は×3 → x＝18"}]},
{id:"R5-2",s:"類題5",t:"次の比例式のxを求めなさい。",sub:[{q:"(2)　39：x＝26：8",a:"x＝12",h:"26x＝312 → x＝12"}]},
{id:"R5-3",s:"類題5",t:"次の比例式のxを求めなさい。",sub:[{q:"(3)　⁹⁄₂₈：x＝1.2：1.6",a:"x＝³⁄₇",h:"1.2：1.6＝3：4\n3x＝⁹⁄₂₈×4＝⁹⁄₇ → x＝³⁄₇"}]},
{id:"R5-4",s:"類題5",t:"次の比例式のxを求めなさい。",sub:[{q:"(4)　⁴⁄₅：x＝⁶⁄₁₁：³⁄₇",a:"x＝²²⁄₃₅",h:"⁶⁄₁₁×x＝⁴⁄₅×³⁄₇＝¹²⁄₃₅\nx＝¹²⁄₃₅÷⁶⁄₁₁＝²²⁄₃₅"}]},
{id:"E5-1-1",s:"演習5 ［1］",t:"次の比例式のxを求めなさい。",sub:[{q:"(1)　4：5＝8：x",a:"x＝10",h:"4→8は×2 → x＝10"}]},
{id:"E5-1-2",s:"演習5 ［1］",t:"次の比例式のxを求めなさい。",sub:[{q:"(2)　3：x＝24：16",a:"x＝2",h:"24：16＝3：2 → x＝2"}]},
{id:"E5-1-3",s:"演習5 ［1］",t:"次の比例式のxを求めなさい。",sub:[{q:"(3)　45：x＝30：8",a:"x＝12",h:"30x＝360 → x＝12"}]},
{id:"E5-1-4",s:"演習5 ［1］",t:"次の比例式のxを求めなさい。",sub:[{q:"(4)　24：6＝x：2",a:"x＝8",h:"24：6＝4：1 → x＝8"}]},
{id:"E5-1-5",s:"演習5 ［1］",t:"次の比例式のxを求めなさい。",sub:[{q:"(5)　x：12＝14：3",a:"x＝56",h:"3x＝168 → x＝56"}]},
{id:"E5-1-6",s:"演習5 ［1］",t:"次の比例式のxを求めなさい。",sub:[{q:"(6)　25：5＝x：3",a:"x＝15",h:"25：5＝5：1 → x＝15"}]},
{id:"E5-1-7",s:"演習5 ［1］",t:"次の比例式のxを求めなさい。",sub:[{q:"(7)　8：x＝48：42",a:"x＝7",h:"48：42＝8：7 → x＝7"}]},
{id:"E5-1-8",s:"演習5 ［1］",t:"次の比例式のxを求めなさい。",sub:[{q:"(8)　32：16＝8：x",a:"x＝4",h:"32：16＝2：1 → x＝4"}]},
{id:"E5-1-9",s:"演習5 ［1］",t:"次の比例式のxを求めなさい。",sub:[{q:"(9)　12：x＝18：21",a:"x＝14",h:"18：21＝6：7 → x＝14"}]},
{id:"E5-2-1",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(1)　1.2：1.8＝x：3",a:"x＝2",h:"1.2：1.8＝2：3 → x＝2"}]},
{id:"E5-2-2",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(2)　1.4：x＝2：5",a:"x＝3.5",h:"2x＝7 → x＝3.5"}]},
{id:"E5-2-3",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(3)　4.2：1.8＝0.7：x",a:"x＝0.3",h:"7：3＝0.7：x → x＝0.3"}]},
{id:"E5-2-4",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(4)　¹⁄₅：⁴⁄₂₅＝x：4",a:"x＝5",h:"5：4＝x：4 → x＝5"}]},
{id:"E5-2-5",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(5)　1³⁄₅：x＝¹⁄₃：³⁄₈",a:"x＝1⁴⁄₅",h:"x＝⁹⁄₅＝1⁴⁄₅"}]},
{id:"E5-2-6",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(6)　1³⁄₈：x＝2¹⁄₅：⁴⁄₅",a:"x＝¹⁄₂",h:"x＝¹⁄₂"}]},
{id:"E5-2-7",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(7)　x：¹⁄₃＝2：2.4",a:"x＝⁵⁄₁₈",h:"5：6 → 6x＝⁵⁄₃ → x＝⁵⁄₁₈"}]},
{id:"E5-2-8",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(8)　³⁄₁₀：¹⁄₂＝2.1：x",a:"x＝3.5",h:"3：5＝2.1：x → x＝3.5"}]},
{id:"E5-2-9",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(9)　2¹⁄₂：x＝4.5：2.4",a:"x＝1¹⁄₃",h:"x＝⁴⁄₃＝1¹⁄₃"}]},
{id:"E5-2-10",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(10)　0.4：³⁄₁₀＝⁴⁄₅：x",a:"x＝0.6",h:"4：3＝⁴⁄₅：x → x＝0.6"}]},
{id:"E5-2-11",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(11)　¹⁄₃₀：0.2＝¹⁄₄：x",a:"x＝1.5",h:"1：6＝¹⁄₄：x → x＝1.5"}]},
{id:"E5-2-12",s:"演習5 ［2］",t:"次の比例式のxを求めなさい。",sub:[{q:"(12)　⁹⁄₂₀：1.2＝x：²⁄₅",a:"x＝0.15",h:"3：8＝x：²⁄₅ → x＝0.15"}]},
{id:"A1",s:"練成問題A ［1］",t:"つくえの中に色えん筆が20本、サインペンが15本入っています。",sub:[
{q:"(1) 色えん筆とサインペンの本数の比をできるだけかん単な整数の比で答えなさい。",a:"4：3",h:"20：15 ÷5 → 4：3"},
{q:"(2) 全体の本数と色えん筆の本数の比をできるだけかん単な整数の比で答えなさい。",a:"7：4",h:"全体35 → 35：20 ÷5 → 7：4"}]},
{id:"A2-1",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(1)　6：3",a:"2：1",h:"÷3 → 2：1"}]},{id:"A2-2",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(2)　18：45",a:"2：5",h:"÷9 → 2：5"}]},{id:"A2-3",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(3)　72：48",a:"3：2",h:"÷24 → 3：2"}]},{id:"A2-4",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(4)　63：147",a:"3：7",h:"÷21 → 3：7"}]},{id:"A2-5",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(5)　0.5：2.5",a:"1：5",h:"×10→5：25 ÷5→1：5"}]},{id:"A2-6",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(6)　0.9：1.2",a:"3：4",h:"×10→9：12 ÷3→3：4"}]},{id:"A2-7",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(7)　0.27：1.26",a:"3：14",h:"×100→27：126 ÷9→3：14"}]},{id:"A2-8",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(8)　3.72：1.32",a:"31：11",h:"×100→372：132 ÷12→31：11"}]},{id:"A2-9",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(9)　⁵⁄₈：³⁄₈",a:"5：3",h:"分母同じ → 5：3"}]},{id:"A2-10",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(10)　2¹⁄₆：²⁄₃",a:"13：4",h:"¹³⁄₆：⁴⁄₆ → 13：4"}]},{id:"A2-11",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(11)　²⁄₇：1¹⁄₃",a:"3：14",h:"→ 3：14"}]},{id:"A2-12",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(12)　3⁷⁄₂₇：⁷⁄₁₈",a:"176：21",h:"→ 176：21"}]},{id:"A2-13",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(13)　0.25：⁵⁄₆",a:"3：10",h:"→ 3：10"}]},{id:"A2-14",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(14)　⁷⁄₁₅：2.4",a:"7：36",h:"→ 7：36"}]},{id:"A2-15",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(15)　3.6L：18dL",a:"2：1",h:"3.6L＝36dL → 2：1"}]},{id:"A2-16",s:"練成問題A ［2］",t:"次の比をできるだけかん単な整数の比にしなさい。",sub:[{q:"(16)　2500cm：0.05m",a:"500：1",h:"0.05m＝5cm → 500：1"}]},
{id:"A3",s:"練成問題A ［3］",t:"",sub:[{q:"たての長さと横の長さの比が4：9である長方形があります。たての長さが7.2cmのとき、横の長さは何cmですか。",a:"16.2cm",h:"①＝7.2÷4＝1.8cm → 横＝16.2cm"}]},
{id:"A4",s:"練成問題A ［4］",t:"",sub:[{q:"ある小学校には5年生が132人いて、男子と女子の人数の比は6：5です。男子は何人いますか。",a:"72人",h:"合計11 → ①＝12人 → 男子72人"}]},
{id:"A5",s:"練成問題A ［5］",t:"",sub:[{q:"長さ6mのひもで、たてと横の長さの比が7：8になるように長方形をつくります。たてと横の長さをそれぞれ何cmにすればよいですか。",a:"たて70cm、横80cm",h:"まわり600cm 半周300cm\n7：8に分ける → たて70cm、横80cm"}]},
{id:"A6",s:"練成問題A ［6］",t:"",sub:[{q:"姉と妹の所持金の比は5：3です。また、姉は妹より700円多く持っています。このとき、姉は何円持っていますか。",a:"1750円",h:"差2が700円 → ①＝350円 → 姉1750円"}]},
{id:"A7",s:"練成問題A ［7］",t:"",sub:[{q:"赤と白と青の3色のおはじきがあわせて240こあり、そのこ数の比は5：8：3になっています。赤と白と青のおはじきはそれぞれ何こありますか。",a:"赤75こ、白120こ、青45こ",h:"合計16 → ①＝15こ → 赤75 白120 青45"}]},
{id:"A8-1",s:"練成問題A ［8］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(1)　A：B＝5：4、B：C＝12：7",a:"15：12：7",h:"B→最小公倍数12 → 15：12：7"}]},{id:"A8-2",s:"練成問題A ［8］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(2)　A：B＝4：7、A：C＝5：3",a:"20：35：12",h:"A→最小公倍数20 → 20：35：12"}]},{id:"A8-3",s:"練成問題A ［8］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(3)　A：C＝3：8、B：C＝7：12",a:"9：14：24",h:"C→最小公倍数24 → 9：14：24"}]},{id:"A8-4",s:"練成問題A ［8］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(4)　A：B＝2：3、B：C＝12：5",a:"8：12：5",h:"B→最小公倍数12 → 8：12：5"}]},{id:"A8-5",s:"練成問題A ［8］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(5)　A：B＝15：8、A：C＝20：9",a:"60：32：27",h:"A→最小公倍数60 → 60：32：27"}]},{id:"A8-6",s:"練成問題A ［8］",t:"次の2つの比例式から、A：B：Cの連比を求めなさい。",sub:[{q:"(6)　A：C＝9：16、B：C＝7：24",a:"27：14：48",h:"C→最小公倍数48 → 27：14：48"}]},
{id:"A9",s:"練成問題A ［9］",t:"",sub:[{q:"あるテストでAさんとBさんの得点の比は3：4、AさんとCさんの得点の比は2：5で、3人の得点の合計は174点でした。Cさんの得点は何点ですか。",a:"90点",h:"A→6：8と6：15\nA：B：C＝6：8：15 合計29\n①＝6点 → C＝90点"}]},
{id:"A10-1",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(1)　7：5＝56：x",a:"x＝40",h:"×8 → x＝40"}]},{id:"A10-2",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(2)　15：6＝x：20",a:"x＝50",h:"6x＝300 → x＝50"}]},{id:"A10-3",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(3)　7.5：5＝0.9：x",a:"x＝0.6",h:"3：2＝0.9：x → x＝0.6"}]},{id:"A10-4",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(4)　³⁄₄：²⁄₃＝x：8",a:"x＝9",h:"9：8＝x：8 → x＝9"}]},{id:"A10-5",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(5)　1³⁄₅：2²⁄₃＝1¹⁄₁₀：x",a:"x＝1⁵⁄₆",h:"3：5 → x＝¹¹⁄₆＝1⁵⁄₆"}]},{id:"A10-6",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(6)　1²⁄₇：x＝1¹⁄₄₉：⁵⁄₉",a:"x＝⁷⁄₁₀",h:"x＝⁷⁄₁₀"}]},{id:"A10-7",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(7)　60：x＝5：2",a:"x＝24",h:"5x＝120 → x＝24"}]},{id:"A10-8",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(8)　2.8：x＝4：3",a:"x＝2.1",h:"4x＝8.4 → x＝2.1"}]},{id:"A10-9",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(9)　x：2.1＝1.2：1.8",a:"x＝1.4",h:"2：3＝x：2.1 → x＝1.4"}]},{id:"A10-10",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(10)　x：2＝45：5",a:"x＝18",h:"9：1＝x：2 → x＝18"}]},{id:"A10-11",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(11)　4¹⁄₂：1⁴⁄₅＝x：¹⁄₃",a:"x＝⁵⁄₆",h:"5：2＝x：¹⁄₃ → x＝⁵⁄₆"}]},{id:"A10-12",s:"練成問題A ［10］",t:"次のxの値を求めなさい。",sub:[{q:"(12)　2.8：1.2＝x：0.6",a:"x＝1.4",h:"7：3＝x：0.6 → x＝1.4"}]}
];

var SEC=[];var sm={};P.forEach(function(p,i){if(!sm[p.s]){sm[p.s]=1;SEC.push({n:p.s,i:i});}});
var COLORS=["#2d2d2d","#ff4d94","#4d94ff","#ff3333","#9933ff","#ff8c1a"];
var WIDTHS=[1.5,2.5,4.5];var STAMPS=["💖","💕","🩷","⭐","🎀","✨","🌸","😊","💯","🌈"];

function Canvas(props){
  var cs=props.cs;
  var gridRef=useRef(null),drawRef=useRef(null),dr=useRef(false),lp=useRef(null),dctx=useRef(null);
  var colR=useRef("#2d2d2d"),widR=useRef(2.5),eraserR=useRef(false),stmpR=useRef(null);
  var _sc=useState(0),selCol=_sc[0],setSC=_sc[1];
  var _sw=useState(1),selW=_sw[0],setSW=_sw[1];
  var _se=useState(false),isE=_se[0],setIsE=_se[1];
  var _ss=useState(null),selStamp=_ss[0],setSS=_ss[1];
  var _sst=useState(false),showSt=_sst[0],setShowSt=_sst[1];

  var drawGrid=useCallback(function(){var c=gridRef.current;if(!c)return;var r=c.getBoundingClientRect(),d=window.devicePixelRatio||2;c.width=r.width*d;c.height=r.height*d;var x=c.getContext("2d");x.scale(d,d);x.strokeStyle="#fce4ec";x.lineWidth=0.5;for(var i=0;i<r.width;i+=26){x.beginPath();x.moveTo(i,0);x.lineTo(i,r.height);x.stroke();}for(var i=0;i<r.height;i+=26){x.beginPath();x.moveTo(0,i);x.lineTo(r.width,i);x.stroke();}},[]);

  var initDraw=useCallback(function(){var c=drawRef.current;if(!c)return;var r=c.getBoundingClientRect(),d=window.devicePixelRatio||2;c.width=r.width*d;c.height=r.height*d;var x=c.getContext("2d");x.scale(d,d);dctx.current=x;},[]);

  useEffect(function(){drawGrid();initDraw();},[cs,drawGrid,initDraw]);
  useEffect(function(){colR.current=COLORS[selCol];widR.current=WIDTHS[selW];eraserR.current=isE;stmpR.current=selStamp;},[selCol,selW,isE,selStamp]);

  useEffect(function(){
    var c=drawRef.current;if(!c)return;
    function gp(e){var r=c.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top};}
    function ts(e){e.preventDefault();e.stopPropagation();var p=gp(e);if(stmpR.current){var x=dctx.current;if(x){x.font="28px serif";x.textAlign="center";x.textBaseline="middle";x.fillText(stmpR.current,p.x,p.y);}return;}dr.current=true;lp.current=p;}
    function tm(e){e.preventDefault();e.stopPropagation();if(!dr.current||!dctx.current||stmpR.current)return;var x=dctx.current,p=gp(e);if(eraserR.current){x.globalCompositeOperation="destination-out";x.lineWidth=24;}else{x.globalCompositeOperation="source-over";x.strokeStyle=colR.current;x.lineWidth=widR.current;}x.lineCap="round";x.lineJoin="round";x.beginPath();x.moveTo(lp.current.x,lp.current.y);x.lineTo(p.x,p.y);x.stroke();x.globalCompositeOperation="source-over";lp.current=p;}
    function te(e){e.preventDefault();e.stopPropagation();dr.current=false;}
    c.addEventListener("touchstart",ts,{passive:false});c.addEventListener("touchmove",tm,{passive:false});c.addEventListener("touchend",te,{passive:false});
    return function(){c.removeEventListener("touchstart",ts);c.removeEventListener("touchmove",tm);c.removeEventListener("touchend",te);};
  },[cs]);

  function gm(e){var r=drawRef.current.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
  function onMD(e){var p=gm(e);if(stmpR.current){var x=dctx.current;if(x){x.font="28px serif";x.textAlign="center";x.textBaseline="middle";x.fillText(stmpR.current,p.x,p.y);}return;}dr.current=true;lp.current=p;}
  function onMM(e){if(!dr.current||!dctx.current||stmpR.current)return;var x=dctx.current,p=gm(e);if(eraserR.current){x.globalCompositeOperation="destination-out";x.lineWidth=24;}else{x.globalCompositeOperation="source-over";x.strokeStyle=colR.current;x.lineWidth=widR.current;}x.lineCap="round";x.lineJoin="round";x.beginPath();x.moveTo(lp.current.x,lp.current.y);x.lineTo(p.x,p.y);x.stroke();x.globalCompositeOperation="source-over";lp.current=p;}

  function tb(act){return{width:30,height:30,borderRadius:"50%",border:act?"3px solid #ff1493":"2px solid #ffd6e7",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:act?"0 0 8px rgba(255,20,147,0.35)":"none",background:"#fff",fontSize:13,flexShrink:0};}

  return React.createElement("div",null,
    React.createElement("div",{style:{position:"relative",borderRadius:18,height:280,overflow:"hidden",boxShadow:"0 3px 16px rgba(255,105,180,0.18)",border:"2.5px solid #ffb6d5",background:"#fff"}},
      React.createElement("canvas",{ref:gridRef,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none"}}),
      React.createElement("canvas",{ref:drawRef,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",touchAction:"none",cursor:selStamp?"copy":isE?"cell":"crosshair"},onMouseDown:onMD,onMouseMove:onMM,onMouseUp:function(){dr.current=false;},onMouseLeave:function(){dr.current=false;}})
    ),
    React.createElement("div",{style:{display:"flex",gap:4,padding:"7px 0 2px",flexWrap:"wrap",alignItems:"center",justifyContent:"center"}},
      COLORS.map(function(c,i){return React.createElement("button",{key:c,onClick:function(){setSC(i);setIsE(false);setSS(null);},style:Object.assign({},tb(selCol===i&&!isE&&!selStamp),{background:c,border:selCol===i&&!isE&&!selStamp?"3px solid "+c:"2px solid #ffd6e7"})});}),
      React.createElement("button",{onClick:function(){setIsE(!isE);setSS(null);},style:tb(isE)},"🧹"),
      React.createElement("div",{style:{width:1,height:24,background:"#ffd6e7",margin:"0 1px"}}),
      WIDTHS.map(function(w,i){return React.createElement("button",{key:i,onClick:function(){setSW(i);setIsE(false);setSS(null);},style:Object.assign({},tb(selW===i&&!isE&&!selStamp),{borderRadius:7,width:32})},React.createElement("div",{style:{width:w*3,height:w*3,borderRadius:"50%",background:isE||selStamp?"#ccc":COLORS[selCol]}}));}),
      React.createElement("div",{style:{width:1,height:24,background:"#ffd6e7",margin:"0 1px"}}),
      React.createElement("button",{onClick:function(){setShowSt(!showSt);},style:Object.assign({},tb(!!selStamp),{borderRadius:7,width:32,fontSize:15})},selStamp||"🎀"),
      React.createElement("button",{onClick:function(){var c=drawRef.current;if(c){var x=c.getContext("2d");x.clearRect(0,0,c.width,c.height);initDraw();}},style:{padding:"4px 8px",borderRadius:7,border:"2px solid #ffb6d5",background:"#fff0f5",color:"#e91e8a",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}},"全消し")
    ),
    showSt?React.createElement("div",{style:{display:"flex",gap:5,padding:"4px",flexWrap:"wrap",justifyContent:"center",background:"#fff0f5",borderRadius:10,margin:"0 0 2px",border:"1.5px dashed #ffb6d5"}},
      React.createElement("button",{onClick:function(){setSS(null);setShowSt(false);},style:{padding:"3px 7px",borderRadius:7,border:!selStamp?"2px solid #ff1493":"1.5px solid #ffd6e7",background:"#fff",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,color:"#e91e8a"}},"ペン✏️"),
      STAMPS.map(function(st){return React.createElement("button",{key:st,onClick:function(){setSS(st);setIsE(false);setShowSt(false);},style:{fontSize:22,background:selStamp===st?"#ffd6e7":"transparent",border:selStamp===st?"2px solid #ff1493":"2px solid transparent",borderRadius:7,padding:"1px 5px",cursor:"pointer"}},st);})
    ):null
  );
}

function App(){
  var _m=useState("home"),mode=_m[0],setMode=_m[1];
  var _ci=useState(0),ci=_ci[0],setCi=_ci[1];
  var _si=useState(0),si=_si[0],setSi=_si[1];
  var _sh=useState(false),show=_sh[0],setShow=_sh[1];
  var _rs=useState({}),res=_rs[0],setRes=_rs[1];
  var _cs=useState(0),cs=_cs[0],setCs=_cs[1];
  var _ro=useState([]),ro=_ro[0],setRo=_ro[1];
  var _rp=useState(0),rp=_rp[0],setRp=_rp[1];
  var _wl=useState([]),wl=_wl[0],setWl=_wl[1];
  var _wp=useState(0),wp=_wp[0],setWp=_wp[1];
  var _hi=useState([]),hist=_hi[0],setHist=_hi[1];
  var _ft=useState(false),fromToc=_ft[0],setFromToc=_ft[1];
  var _jk=useState(""),judgedKey=_jk[0],setJudgedKey=_jk[1];

  var probs=(mode==="random"||mode==="weak")?ro.map(function(i){return P[i];}):mode==="wrong"?wl:P;
  var pos=(mode==="random"||mode==="weak")?rp:mode==="wrong"?wp:ci;
  var setPos=(mode==="random"||mode==="weak")?setRp:mode==="wrong"?setWp:setCi;
  var cur=probs[pos],tot=probs.length;

  function startSeq(){setMode("seq");setCi(0);setSi(0);setShow(false);setCs(function(s){return s+1;});setHist([]);setFromToc(false);}
  function startRand(){var o=P.map(function(_,i){return i;});for(var i=o.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=o[i];o[i]=o[j];o[j]=t;}setRo(o);setRp(0);setSi(0);setShow(false);setCs(function(s){return s+1;});setMode("random");setHist([]);setFromToc(false);}
  function startWrong(){var w=[];Object.keys(res).forEach(function(k){var v=res[k];if(v&&v.w>0){var parts=k.split("__");var pid=parts[0],s=parseInt(parts[1]);var p=P.find(function(x){return x.id===pid;});if(p)w.push(Object.assign({},p,{_fs:s}));}});if(!w.length){alert("まちがえた問題はないよ！✨");return;}setWl(w);setWp(0);setSi(0);setShow(false);setCs(function(s){return s+1;});setMode("wrong");setHist([]);setFromToc(false);}
  function startWeak(){var ids={};P.forEach(function(p){p.sub.forEach(function(sb,si2){var k=p.id+"__"+si2;var v=res[k];if(v&&v.w>0&&v.w>=v.c)ids[P.indexOf(p)]=true;});});var arr=Object.keys(ids).map(function(x){return parseInt(x);});if(!arr.length){alert("にがてな問題はまだないよ！💪");return;}for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}setRo(arr);setRp(0);setSi(0);setShow(false);setCs(function(s){return s+1;});setMode("weak");setHist([]);setFromToc(false);}
  function jumpTo(idx){setCi(idx);setSi(0);setShow(false);setCs(function(s){return s+1;});setMode("seq");setHist([]);setFromToc(true);}
  function adv(){var msi=mode==="wrong"?0:si;if(mode!=="wrong"&&msi<cur.sub.length-1){setHist(function(p){return p.concat([{pos:pos,si:si}]);});setSi(msi+1);setShow(false);setCs(function(s){return s+1;});}else if(pos<tot-1){setHist(function(p){return p.concat([{pos:pos,si:msi}]);});setPos(pos+1);setSi(0);setShow(false);setCs(function(s){return s+1;});}else{setShow(false);setMode("done");}}
  function mark(c){var asi=mode==="wrong"&&cur._fs!==undefined?cur._fs:si;var k=cur.id+"__"+asi;setJudgedKey(k);setRes(function(p){var n={};Object.keys(p).forEach(function(x){n[x]=p[x];});var prev=n[k]||{c:0,w:0};n[k]=c?{c:prev.c+1,w:prev.w}:{c:prev.c,w:prev.w+1};return n;});}
  function back(){if(!hist.length)return;var p=hist[hist.length-1];setHist(function(h){return h.slice(0,-1);});setPos(p.pos);setSi(p.si);setShow(false);setCs(function(s){return s+1;});}

  var wc=0,cc=0;Object.keys(res).forEach(function(k){var v=res[k];if(v){cc+=v.c;wc+=v.w;}});
  var weakIds={};P.forEach(function(p){p.sub.forEach(function(sb,si2){var k=p.id+"__"+si2;var v=res[k];if(v&&v.w>0&&v.w>=v.c)weakIds[p.id]=true;});});var weakCount=Object.keys(weakIds).length;

  var pg={minHeight:"100vh",background:"linear-gradient(180deg,#fff0f5 0%,#fce4ec 50%,#fff0f5 100%)",fontFamily:"'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif",maxWidth:480,margin:"0 auto",WebkitFontSmoothing:"antialiased",overscrollBehavior:"none",position:"relative"};
  function mb(bg){return{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"16px 18px",borderRadius:16,border:"2px solid rgba(255,255,255,0.5)",background:bg,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(255,105,180,0.25)",fontFamily:"inherit",position:"relative"};}
  var bk={background:"#fff",border:"1.5px solid #ffd6e7",borderRadius:10,padding:"7px 12px",fontSize:13,fontWeight:700,color:"#ff1493",cursor:"pointer",boxShadow:"0 2px 6px rgba(255,105,180,0.1)",fontFamily:"inherit",flexShrink:0};

  if(mode==="home")return React.createElement("div",{style:pg},
    React.createElement("div",{style:{textAlign:"center",paddingTop:40,paddingBottom:8}},
      React.createElement("div",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:76,height:76,borderRadius:22,background:"linear-gradient(135deg,#ff69b4,#ff1493)",color:"#fff",fontSize:32,fontWeight:900,marginBottom:12,boxShadow:"0 8px 28px rgba(255,105,180,0.4)",border:"3px solid #fff"}},"💖比"),
      React.createElement("h1",{style:{margin:"0 0 2px",fontSize:23,fontWeight:900,color:"#d6336c"}},"算数ドリル 第6回"),
      React.createElement("p",{style:{margin:0,fontSize:13,color:"#e8748a"}},"✨ 5年生 — 比の問題 ✨")),
    React.createElement("div",{style:{display:"flex",justifyContent:"center",gap:10,padding:"10px 20px"}},
      [[P.length,"#ff69b4","全問題"],[cc,"#2d9f6f","正解♪"],[wc,"#e63946","不正解"]].map(function(arr,i){return React.createElement("div",{key:i,style:{flex:1,maxWidth:95,background:"#fff",borderRadius:14,padding:"12px 6px",textAlign:"center",border:"1.5px solid #ffd6e7"}},React.createElement("div",{style:{fontSize:26,fontWeight:800,color:arr[1]}},arr[0]),React.createElement("div",{style:{fontSize:10,color:"#e8748a",marginTop:2}},arr[2]));})),
    React.createElement("div",{style:{padding:"8px 18px 36px",display:"flex",flexDirection:"column",gap:10}},
      React.createElement("button",{style:mb("linear-gradient(135deg,#ff69b4,#ff1493)"),onClick:startSeq},"📖　順番に出題"),
      React.createElement("button",{style:mb("linear-gradient(135deg,#da70d6,#ba55d3)"),onClick:startRand},"🎲　ランダム出題"),
      React.createElement("button",{style:mb("linear-gradient(135deg,#ff6b81,#ee5a70)"),onClick:startWrong},"❌　まちがえた問題",wc>0?React.createElement("span",{style:{position:"absolute",right:14,background:"#fff",color:"#e63946",borderRadius:18,padding:"1px 9px",fontSize:13,fontWeight:800}},wc):null),
      React.createElement("button",{style:mb("linear-gradient(135deg,#e67e22,#f39c12)"),onClick:startWeak},"🔥　にがて問題",weakCount>0?React.createElement("span",{style:{position:"absolute",right:14,background:"#fff",color:"#e67e22",borderRadius:18,padding:"1px 9px",fontSize:13,fontWeight:800}},weakCount):null),
      React.createElement("button",{style:mb("linear-gradient(135deg,#f78da7,#f06292)"),onClick:function(){setMode("toc");}},"📋　もくじから選ぶ"),
      React.createElement("button",{style:mb("linear-gradient(135deg,#64b5f6,#42a5f5)"),onClick:function(){setMode("stats");}},"📊　きろくを見る")));

  if(mode==="toc")return React.createElement("div",{style:pg},
    React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"14px 16px 8px"}},
      React.createElement("button",{style:bk,onClick:function(){setMode("home");}},"💖 メニュー"),
      React.createElement("h2",{style:{margin:0,fontSize:19,fontWeight:800,color:"#d6336c"}},"📋 もくじ")),
    React.createElement("div",{style:{padding:"4px 14px 32px",display:"flex",flexDirection:"column",gap:5}},
      SEC.map(function(s,i){return React.createElement("button",{key:i,style:{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",background:"#fff",borderRadius:12,border:"1.5px solid #ffd6e7",cursor:"pointer",fontFamily:"inherit",textAlign:"left"},onClick:function(){jumpTo(s.i);}},
        React.createElement("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:30,height:30,borderRadius:8,background:"#fff0f5",color:"#ff1493",fontSize:12,fontWeight:800,border:"1px solid #ffd6e7"}},s.i+1),
        React.createElement("span",{style:{flex:1,fontSize:14,fontWeight:600,color:"#d6336c"}},s.n),
        React.createElement("span",{style:{color:"#ffb6d5",fontSize:18}},"♡"));})));

  if(mode==="stats"){
    var statRows=[];
    P.forEach(function(p,pi){
      p.sub.forEach(function(sb,si2){
        var k=p.id+"__"+si2;var v=res[k];
        if(v&&(v.c>0||v.w>0)){
          var isWeak=v.w>0&&v.w>=v.c;
          statRows.push({s:p.s,q:sb.q,c:v.c,w:v.w,weak:isWeak});
        }
      });
    });
    return React.createElement("div",{style:pg},
      React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"14px 16px 8px"}},
        React.createElement("button",{style:bk,onClick:function(){setMode("home");}},"💖 メニュー"),
        React.createElement("h2",{style:{margin:0,fontSize:19,fontWeight:800,color:"#d6336c"}},"📊 きろく")),
      React.createElement("div",{style:{display:"flex",justifyContent:"center",gap:10,padding:"0 14px 8px"}},
        React.createElement("div",{style:{background:"#fff",borderRadius:12,padding:"10px 16px",textAlign:"center",border:"1.5px solid #ffd6e7"}},
          React.createElement("div",{style:{fontSize:22,fontWeight:800,color:"#2d9f6f"}},cc),React.createElement("div",{style:{fontSize:10,color:"#e8748a"}},"正解 合計")),
        React.createElement("div",{style:{background:"#fff",borderRadius:12,padding:"10px 16px",textAlign:"center",border:"1.5px solid #ffd6e7"}},
          React.createElement("div",{style:{fontSize:22,fontWeight:800,color:"#e63946"}},wc),React.createElement("div",{style:{fontSize:10,color:"#e8748a"}},"不正解 合計")),
        React.createElement("div",{style:{background:"#fff",borderRadius:12,padding:"10px 16px",textAlign:"center",border:"1.5px solid #ffd6e7"}},
          React.createElement("div",{style:{fontSize:22,fontWeight:800,color:"#e67e22"}},weakCount),React.createElement("div",{style:{fontSize:10,color:"#e8748a"}},"にがて"))),
      React.createElement("div",{style:{padding:"4px 14px 10px",maxHeight:"55vh",overflowY:"auto"}},
        statRows.length>0?statRows.map(function(r,i){
          return React.createElement("div",{key:i,style:{background:"#fff",borderRadius:10,padding:"8px 12px",marginBottom:4,border:"1.5px solid #ffd6e7",display:"flex",alignItems:"center",gap:6}},
            React.createElement("span",{style:{flex:1,fontSize:12,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},React.createElement(FracText,{text:r.q})),
            React.createElement("span",{style:{color:"#2d9f6f",fontWeight:700,fontSize:12,flexShrink:0}},"⭕"+r.c),
            React.createElement("span",{style:{color:"#e63946",fontWeight:700,fontSize:12,flexShrink:0}},"❌"+r.w),
            r.weak?React.createElement("span",{style:{fontSize:10,flexShrink:0}},"🔥"):null);
        }):React.createElement("div",{style:{textAlign:"center",padding:30,color:"#e8748a",fontSize:14}},"まだ記録がないよ！",React.createElement("br",null),"問題をといてみてね💖")),
      React.createElement("div",{style:{padding:"8px 14px 20px"}},
        React.createElement("button",{onClick:function(){if(window.confirm("全ての記録をリセットしますか？")){setRes({});}},style:{width:"100%",padding:"12px",borderRadius:12,border:"2px solid #ffb6d5",background:"#fff",color:"#e63946",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}},"🗑️ 記録をリセットする")));
  }

  if(mode==="done")return React.createElement("div",{style:pg},
    React.createElement("div",{style:{textAlign:"center",paddingTop:70}},
      React.createElement("div",{style:{fontSize:64,marginBottom:8}},"🎉💖✨"),
      React.createElement("h2",{style:{margin:"0 0 6px",color:"#d6336c",fontSize:24,fontFamily:"inherit"}},"おつかれさま！"),
      React.createElement("p",{style:{color:"#e8748a",fontSize:15,margin:"0 0 20px"}},"がんばったね！すごい！💕"),
      React.createElement("div",{style:{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}},
        React.createElement("button",{style:mb("linear-gradient(135deg,#ff69b4,#ff1493)"),onClick:function(){setMode("home");}},"💖 メニューに戻る"),
        wc>0?React.createElement("button",{style:mb("linear-gradient(135deg,#ff6b81,#ee5a70)"),onClick:startWrong},"❌ やり直す"):null)));

  var asi=mode==="wrong"&&cur&&cur._fs!==undefined?cur._fs:si;
  var asub=cur&&cur.sub?cur.sub[asi]:null;
  var rk=cur?cur.id+"__"+asi:"";
  var tr=res[rk];
  var isLast=pos>=tot-1&&(mode==="wrong"||asi>=(cur&&cur.sub?cur.sub.length:1)-1);

  return React.createElement("div",{style:pg},
    React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6,padding:"10px 14px 4px"}},
      React.createElement("button",{style:bk,onClick:function(){setMode("home");}},"💖 メニュー"),
      fromToc?React.createElement("button",{style:Object.assign({},bk,{color:"#da70d6",borderColor:"#e8b4f8"}),onClick:function(){setMode("toc");setFromToc(false);}},"📋 もくじ"):null,
      React.createElement("div",{style:{flex:1}},
        React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e8748a",textAlign:"right",marginBottom:3}},"♡ "+(pos+1)+" / "+tot),
        React.createElement("div",{style:{height:6,borderRadius:3,background:"#fce4ec",overflow:"hidden"}},
          React.createElement("div",{style:{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#ff69b4,#ff1493,#da70d6)",width:((pos+1)/tot*100)+"%",transition:"width 0.3s"}})))),
    React.createElement("div",{style:{padding:"2px 18px 4px",fontSize:11,fontWeight:700,color:"#f06292",letterSpacing:1}},"✨ "+(cur?cur.s:"")),
    React.createElement("div",{style:{margin:"0 14px 6px",background:"#fff",borderRadius:16,padding:"14px 16px",boxShadow:"0 2px 10px rgba(255,105,180,0.1)",border:"1.5px solid #ffd6e7"}},
      cur&&cur.t?React.createElement("div",{style:{fontSize:13.5,color:"#886",margin:"0 0 8px",lineHeight:1.8,borderBottom:"1.5px dashed #ffd6e7",paddingBottom:8}},React.createElement(FracText,{text:cur.t})):null,
      React.createElement("div",{style:{fontSize:16.5,color:"#c2185b",margin:0,lineHeight:2,fontWeight:700}},React.createElement(FracText,{text:asub?asub.q:""})),
      cur&&cur.sub&&cur.sub.length>1&&mode!=="wrong"?React.createElement("div",{style:{marginTop:6,fontSize:11,color:"#f06292",fontWeight:600}},"💗 小問 "+(asi+1)+" / "+cur.sub.length):null),
    React.createElement("div",{style:{margin:"0 14px 2px"}},React.createElement(Canvas,{cs:cs})),
    !show?React.createElement("div",{style:{padding:"4px 14px"}},
      React.createElement("button",{style:{width:"100%",padding:"15px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#ff69b4,#ff1493)",color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 16px rgba(255,105,180,0.3)"},onClick:function(){setShow(true);}},"💖 答えを見る"))
    :React.createElement("div",{style:{padding:"4px 14px"}},
      React.createElement("div",{style:{background:"#fffbf0",border:"2.5px solid #ffd700",borderRadius:14,padding:"12px 16px",marginBottom:8}},
        React.createElement("div",{style:{fontSize:10,fontWeight:800,color:"#e6a800",letterSpacing:2,marginBottom:4}},"✨ こたえ ✨"),
        React.createElement("div",{style:{fontSize:20,fontWeight:800,color:"#c2185b",lineHeight:2}},React.createElement(FracText,{text:asub?asub.a:""}))),
      asub&&asub.h?React.createElement("div",{style:{background:"#fff0f8",border:"2px solid #ffb6d5",borderRadius:14,padding:"12px 16px",marginBottom:8}},
        React.createElement("div",{style:{fontSize:10,fontWeight:800,color:"#e91e8a",letterSpacing:2,marginBottom:4}},"💡 かいせつ"),
        React.createElement(FracBlock,{text:asub.h,style:{fontSize:14,color:"#8b3a62",lineHeight:2,fontWeight:500}})):null,
      judgedKey!==rk?React.createElement("div",{style:{display:"flex",gap:8,marginBottom:6}},
        React.createElement("button",{style:{flex:1,padding:"13px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#2d9f6f,#27ae60)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},onClick:function(){mark(true);}},"⭕ 正解！"),
        React.createElement("button",{style:{flex:1,padding:"13px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#e63946,#d32f2f)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},onClick:function(){mark(false);}},"❌ 不正解"))
      :React.createElement("div",{style:{textAlign:"center",padding:"8px 0 2px",fontSize:14,fontWeight:700,color:"#e8748a"}},"記録したよ♪",tr?" （⭕"+tr.c+" ❌"+tr.w+"）":""),
      React.createElement("button",{style:{width:"100%",padding:"14px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#da70d6,#ba55d3)",color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(218,112,214,0.3)",marginTop:4},onClick:adv},isLast?"おわり 🎉💖":"つぎの問題 →💕")),
    React.createElement("div",{style:{padding:"8px 14px 16px",display:"flex",gap:8}},
      React.createElement("button",{style:{flex:1,padding:"10px",borderRadius:10,border:"1.5px solid #ffd6e7",background:"#fff",fontSize:13,fontWeight:600,color:hist.length?"#e8748a":"#f5c6d8",cursor:hist.length?"pointer":"default",fontFamily:"inherit"},disabled:!hist.length,onClick:back},"← 1問もどる"),
      React.createElement("button",{style:{padding:"10px 14px",borderRadius:10,border:"1.5px solid #ffd6e7",background:"#fff",fontSize:11,fontWeight:600,color:"#cba0b0",cursor:"pointer",fontFamily:"inherit",flexShrink:0},onClick:adv},"スキップ »")));
}

export default App;
