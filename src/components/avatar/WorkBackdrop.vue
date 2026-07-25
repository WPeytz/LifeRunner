<script setup lang="ts">
type WorkTheme =
  | 'generic' | 'retail' | 'restaurant' | 'cafe' | 'warehouse' | 'call-center'
  | 'office' | 'tech' | 'healthcare' | 'finance' | 'education' | 'engineering'
  | 'electrician' | 'plumber' | 'mechanic' | 'legal' | 'casino' | 'film'
  | 'government' | 'driving' | 'marketing' | 'laboratory' | 'nonprofit' | 'remote'

withDefaults(defineProps<{ theme?: WorkTheme }>(), { theme: 'generic' })
</script>

<template>
  <svg class="work-backdrop" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" role="img" :aria-label="`A ${theme} workplace`">
    <defs>
      <linearGradient id="work-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b7c8cf" /><stop offset="1" stop-color="#859ba5" />
      </linearGradient>
      <linearGradient id="work-window" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#78b6d2" /><stop offset="1" stop-color="#d3e4e6" />
      </linearGradient>
      <filter id="work-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#18222b" flood-opacity=".25" />
      </filter>
    </defs>

    <!-- Shared indoor shell -->
    <rect width="800" height="590" fill="url(#work-wall)" />
    <rect y="590" width="800" height="210" fill="#4b5961" />
    <path d="M0 646 H800 M0 715 H800 M92 590 L65 800 M258 590 L245 800 M542 590 L555 800 M708 590 L735 800" stroke="#38444b" stroke-width="5" opacity=".55" />
    <rect x="250" y="54" width="300" height="214" rx="8" fill="url(#work-window)" stroke="#566b76" stroke-width="15" />
    <path d="M400 62 V260 M258 160 H542" stroke="#566b76" stroke-width="10" />
    <path d="M258 235 L315 181 L360 229 L432 170 L542 246 V260 H258Z" fill="#658a87" opacity=".72" />
    <rect y="565" width="800" height="30" fill="#34434b" />
    <ellipse cx="400" cy="744" rx="185" ry="42" fill="#27343b" opacity=".33" />

    <!-- Job search / category selection -->
    <g v-if="theme === 'generic'" filter="url(#work-shadow)">
      <rect x="35" y="248" width="186" height="296" rx="10" fill="#e9e0cd" stroke="#775d49" stroke-width="10" />
      <g fill="#d9b95f"><rect x="60" y="279" width="62" height="74" /><rect x="133" y="298" width="61" height="84" /></g>
      <g stroke="#715f4a" stroke-width="6"><path d="M72 300 H109 M72 320 H102 M145 321 H184 M145 342 H178" /></g>
      <rect x="578" y="334" width="190" height="116" rx="12" fill="#354657" />
      <path d="M601 365 H742 M601 394 H701 M601 423 H728" stroke="#83c9b0" stroke-width="10" stroke-linecap="round" />
      <rect x="625" y="476" width="100" height="55" rx="8" fill="#cc9560" />
      <path d="M649 476 Q650 441 675 441 Q701 441 702 476" fill="none" stroke="#7c5438" stroke-width="9" />
    </g>

    <!-- Shop floor -->
    <g v-else-if="theme === 'retail'" filter="url(#work-shadow)">
      <g fill="#e8dfcb" stroke="#80664f" stroke-width="8"><rect x="28" y="227" width="190" height="337" /><rect x="582" y="227" width="190" height="337" /></g>
      <g fill="#d56559"><rect x="48" y="268" width="50" height="78" /><rect x="118" y="287" width="68" height="59" /></g>
      <g fill="#5f89a5"><rect x="48" y="382" width="70" height="75" /><rect x="137" y="398" width="49" height="59" /></g>
      <g fill="#d7ae52"><rect x="614" y="265" width="57" height="82" /><rect x="688" y="282" width="57" height="65" /><rect x="614" y="385" width="131" height="72" /></g>
      <rect x="572" y="505" width="208" height="74" rx="8" fill="#6e4c3c" /><rect x="624" y="462" width="91" height="58" rx="6" fill="#343c45" />
    </g>

    <!-- Restaurant kitchen -->
    <g v-else-if="theme === 'restaurant'" filter="url(#work-shadow)">
      <rect x="26" y="272" width="212" height="292" fill="#c9d0cf" stroke="#69777a" stroke-width="9" />
      <rect x="45" y="304" width="174" height="102" fill="#87979b" /><g fill="#273139"><circle cx="83" cy="337" r="16" /><circle cx="178" cy="337" r="16" /></g>
      <rect x="52" y="429" width="160" height="104" rx="6" fill="#47545a" /><rect x="573" y="382" width="202" height="182" fill="#b38155" />
      <rect x="556" y="365" width="234" height="36" fill="#4d4843" />
      <path d="M617 265 V351 M652 265 V351 M687 265 V351" stroke="#4e5658" stroke-width="8" /><g fill="#d14f49"><circle cx="615" cy="352" r="18" /></g><g fill="#e4bc4f"><circle cx="654" cy="352" r="18" /></g>
    </g>

    <!-- Coffee shop -->
    <g v-else-if="theme === 'cafe'" filter="url(#work-shadow)">
      <rect x="32" y="252" width="192" height="160" rx="10" fill="#3e3030" /><path d="M58 292 H198 M58 330 H178 M58 370 H206" stroke="#f1d5a0" stroke-width="9" />
      <rect x="555" y="386" width="238" height="178" fill="#9a6545" /><rect x="539" y="368" width="261" height="35" fill="#493b36" />
      <rect x="590" y="294" width="144" height="87" rx="9" fill="#66767a" /><circle cx="629" cy="330" r="17" fill="#20282d" /><path d="M682 311 Q729 333 682 355Z" fill="#ced5d2" />
      <g transform="translate(83 464)"><path d="M0 0 H102 V63 Q51 96 0 63Z" fill="#f3eee1" /><path d="M102 15 Q144 15 136 50 Q130 73 101 64" fill="none" stroke="#f3eee1" stroke-width="15" /><path d="M29 -12 Q12 -36 31 -53 M57 -12 Q40 -38 59 -58" fill="none" stroke="#e9dcc7" stroke-width="7" /></g>
    </g>

    <!-- Logistics warehouse -->
    <g v-else-if="theme === 'warehouse'" filter="url(#work-shadow)">
      <g stroke="#4c5a61" stroke-width="13"><path d="M28 234 V572 M218 234 V572 M28 260 H218 M28 410 H218" /><path d="M582 234 V572 M772 234 V572 M582 260 H772 M582 410 H772" /></g>
      <g fill="#b77845"><rect x="48" y="282" width="68" height="103" /><rect x="127" y="305" width="69" height="80" /><rect x="48" y="433" width="92" height="115" /><rect x="151" y="459" width="45" height="89" /><rect x="602" y="282" width="72" height="104" /><rect x="686" y="321" width="65" height="65" /><rect x="602" y="435" width="150" height="112" /></g>
      <g transform="translate(556 611)"><rect width="190" height="72" rx="10" fill="#d6a53f" /><rect x="130" y="-74" width="31" height="80" fill="#d6a53f" /><path d="M159 -67 H205 V48" fill="none" stroke="#343f44" stroke-width="13" /><circle cx="42" cy="72" r="24" fill="#242c30" /><circle cx="151" cy="72" r="24" fill="#242c30" /></g>
    </g>

    <!-- Call centre -->
    <g v-else-if="theme === 'call-center'" filter="url(#work-shadow)">
      <g fill="#768a94"><rect x="28" y="282" width="204" height="282" /><rect x="568" y="282" width="204" height="282" /></g>
      <g fill="#283543" stroke="#526c7e" stroke-width="7"><rect x="54" y="325" width="145" height="99" rx="8" /><rect x="601" y="325" width="137" height="99" rx="8" /></g>
      <path d="M87 459 Q126 416 166 459 M87 459 V499 M166 459 V499 M78 498 H104 M149 498 H177" fill="none" stroke="#27333c" stroke-width="10" />
      <path d="M621 458 Q669 414 718 458 M621 458 V501 M718 458 V501" fill="none" stroke="#27333c" stroke-width="10" />
    </g>

    <!-- Corporate office and sales -->
    <g v-else-if="theme === 'office'" filter="url(#work-shadow)">
      <rect x="28" y="252" width="196" height="140" rx="10" fill="#f0eee5" stroke="#667781" stroke-width="9" /><path d="M58 350 L98 309 L137 329 L188 278" fill="none" stroke="#56a47a" stroke-width="10" /><path d="M169 278 H188 V297" fill="none" stroke="#56a47a" stroke-width="10" />
      <rect x="548" y="391" width="244" height="57" rx="8" fill="#6c4e3e" /><path d="M576 448 V561 M762 448 V561" stroke="#50382e" stroke-width="13" />
      <rect x="591" y="292" width="150" height="107" rx="7" fill="#263649" /><path d="M618 324 H713 M618 353 H691" stroke="#8ac5b2" stroke-width="9" />
      <g transform="translate(62 448)"><rect width="139" height="91" rx="7" fill="#b98d56" /><path d="M25 0 Q26 -34 70 -34 Q113 -34 114 0" fill="none" stroke="#705037" stroke-width="10" /></g>
    </g>

    <!-- Software and IT -->
    <g v-else-if="theme === 'tech'" filter="url(#work-shadow)">
      <g fill="#222b3c" stroke="#4f6177" stroke-width="8"><rect x="25" y="262" width="205" height="145" rx="9" /><rect x="570" y="258" width="205" height="148" rx="9" /></g>
      <g stroke="#67d6a7" stroke-width="9" stroke-linecap="round"><path d="M53 301 H118 M53 332 H178 M53 363 H143" /><path d="M599 298 H672 M599 330 H744 M599 362 H692" /></g>
      <g stroke="#e2b85c" stroke-width="9" stroke-linecap="round"><path d="M132 301 H198 M191 332 H211 M158 363 H205" /><path d="M688 298 H745 M708 362 H752" /></g>
      <rect x="27" y="443" width="194" height="120" rx="9" fill="#536575" /><g fill="#8fd3b4"><circle cx="58" cy="473" r="8" /><circle cx="58" cy="507" r="8" /><circle cx="58" cy="541" r="8" /></g><path d="M82 473 H188 M82 507 H188 M82 541 H188" stroke="#283746" stroke-width="12" />
      <rect x="579" y="461" width="185" height="91" rx="10" fill="#44525e" /><path d="M605 486 H739 M625 519 H718" stroke="#cad4d7" stroke-width="12" />
    </g>

    <!-- Hospital and clinic -->
    <g v-else-if="theme === 'healthcare'" filter="url(#work-shadow)">
      <rect x="35" y="256" width="181" height="181" rx="12" fill="#e9f1ee" /><path d="M105 287 H147 V333 H192 V375 H147 V421 H105 V375 H60 V333 H105Z" fill="#d45359" />
      <rect x="548" y="398" width="238" height="128" rx="28" fill="#d8ecea" stroke="#65919a" stroke-width="9" /><rect x="567" y="378" width="76" height="49" rx="18" fill="#f4f6ee" />
      <path d="M575 526 V564 M757 526 V564" stroke="#47575c" stroke-width="12" /><circle cx="574" cy="570" r="13" fill="#303b40" /><circle cx="758" cy="570" r="13" fill="#303b40" />
      <path d="M619 287 Q654 246 690 287 V349 Q653 389 617 349Z" fill="none" stroke="#446e78" stroke-width="10" /><circle cx="617" cy="348" r="13" fill="#d8ecea" stroke="#446e78" stroke-width="7" />
      <path d="M731 274 V372 M706 303 H756" stroke="#d45359" stroke-width="10" />
    </g>

    <!-- Banking, accounting and trading -->
    <g v-else-if="theme === 'finance'" filter="url(#work-shadow)">
      <g fill="#18283a" stroke="#536a7a" stroke-width="8"><rect x="26" y="254" width="204" height="155" rx="9" /><rect x="570" y="254" width="204" height="155" rx="9" /></g>
      <path d="M48 366 L83 327 L119 346 L154 288 L204 318" fill="none" stroke="#5fd39b" stroke-width="9" /><path d="M594 315 H747 M594 348 H710 M594 378 H735" stroke="#e7bc5e" stroke-width="9" />
      <rect x="558" y="447" width="224" height="116" rx="8" fill="#665044" /><g fill="#f1e4bd"><rect x="581" y="470" width="75" height="52" /><rect x="670" y="470" width="85" height="52" /></g><path d="M595 487 H644 M684 487 H742 M684 505 H728" stroke="#6b8b78" stroke-width="6" />
      <g transform="translate(60 453)"><circle cx="64" cy="52" r="52" fill="#dbb44f" /><text x="64" y="70" fill="#66502c" font-size="52" font-weight="800" text-anchor="middle">$</text></g>
    </g>

    <!-- School or university classroom -->
    <g v-else-if="theme === 'education'" filter="url(#work-shadow)">
      <rect x="24" y="235" width="752" height="187" rx="9" fill="#304f45" stroke="#8b694d" stroke-width="13" />
      <path d="M63 286 H253 M63 329 H325 M502 286 H731 M549 329 H731" stroke="#e9e2c7" stroke-width="9" stroke-linecap="round" />
      <path d="M87 378 Q145 323 201 378 M580 378 L622 300 L665 378" fill="none" stroke="#e0bb62" stroke-width="9" />
      <g fill="#b58a5d"><rect x="35" y="482" width="188" height="48" rx="7" /><rect x="577" y="482" width="188" height="48" rx="7" /></g><path d="M62 530 V568 M196 530 V568 M604 530 V568 M738 530 V568" stroke="#76583f" stroke-width="11" />
      <g fill="#e7d59f"><rect x="75" y="453" width="72" height="22" transform="rotate(-8 75 453)" /><rect x="638" y="451" width="72" height="22" transform="rotate(7 638 451)" /></g>
    </g>

    <!-- Engineering studio -->
    <g v-else-if="theme === 'engineering'" filter="url(#work-shadow)">
      <rect x="25" y="240" width="207" height="245" rx="9" fill="#d9edf0" stroke="#527181" stroke-width="10" /><g stroke="#5d86a0" stroke-width="6" fill="none"><path d="M52 445 V292 H204 M65 409 L106 345 L146 389 L192 301" /><circle cx="107" cy="345" r="18" /><path d="M61 322 H121 M150 423 H205" /></g>
      <rect x="565" y="404" width="220" height="58" rx="8" fill="#6c513f" /><path d="M596 462 V566 M754 462 V566" stroke="#4a382f" stroke-width="12" />
      <path d="M594 398 L648 286 L742 398Z" fill="#dae8e6" stroke="#53646a" stroke-width="9" /><path d="M647 286 V398 M620 343 H708" stroke="#85a2aa" stroke-width="6" />
      <g transform="translate(615 479)"><circle cx="40" cy="40" r="34" fill="none" stroke="#d6a64e" stroke-width="13" stroke-dasharray="14 8" /><circle cx="40" cy="40" r="11" fill="#d6a64e" /></g>
    </g>

    <!-- Electrical worksite -->
    <g v-else-if="theme === 'electrician'" filter="url(#work-shadow)">
      <rect x="28" y="242" width="205" height="290" rx="9" fill="#69777d" stroke="#303b40" stroke-width="10" /><g fill="#d9dede"><rect x="58" y="283" width="145" height="57" /><rect x="58" y="366" width="145" height="57" /></g><g fill="#30383d"><rect x="75" y="297" width="28" height="30" /><rect x="119" y="297" width="28" height="30" /><rect x="163" y="297" width="28" height="30" /><rect x="75" y="380" width="28" height="30" /><rect x="119" y="380" width="28" height="30" /><rect x="163" y="380" width="28" height="30" /></g>
      <path d="M596 252 Q737 326 598 419 Q706 480 620 558" fill="none" stroke="#d04f4f" stroke-width="14" /><path d="M647 242 Q555 337 735 392 Q606 475 734 548" fill="none" stroke="#e5c44f" stroke-width="14" />
      <path d="M661 315 L616 406 H666 L627 498 L729 380 H679 L716 315Z" fill="#f6d554" stroke="#654f29" stroke-width="7" />
    </g>

    <!-- Plumbing worksite -->
    <g v-else-if="theme === 'plumber'" filter="url(#work-shadow)">
      <g fill="none" stroke="#678391" stroke-width="27"><path d="M49 242 V392 H213 V552" /><path d="M750 238 V361 H592 V553" /></g><g fill="#788f98" stroke="#4a626c" stroke-width="7"><circle cx="49" cy="392" r="31" /><circle cx="750" cy="361" r="31" /></g>
      <rect x="576" y="432" width="205" height="117" rx="14" fill="#e7eeeb" stroke="#78969b" stroke-width="9" /><path d="M626 431 Q625 365 680 365 Q735 365 734 431" fill="none" stroke="#687b7e" stroke-width="12" /><circle cx="679" cy="482" r="18" fill="#87b5c5" />
      <g transform="translate(70 455)"><path d="M0 0 H142 V96 H0Z" fill="#b87645" /><path d="M31 0 Q31 -34 71 -34 Q111 -34 111 0" fill="none" stroke="#694732" stroke-width="10" /><path d="M45 30 L101 81 M101 30 L45 81" stroke="#d5d9d8" stroke-width="13" /></g>
    </g>

    <!-- Auto repair garage -->
    <g v-else-if="theme === 'mechanic'" filter="url(#work-shadow)">
      <rect x="22" y="226" width="225" height="335" fill="#5e686c" /><path d="M22 286 H247 M22 354 H247 M22 422 H247 M22 490 H247" stroke="#879397" stroke-width="8" /><g fill="#d4dade"><rect x="54" y="304" width="161" height="32" /><rect x="54" y="440" width="161" height="32" /></g>
      <g transform="translate(524 403)"><path d="M0 74 L35 21 H174 L220 74 V137 H0Z" fill="#c95455" /><path d="M51 21 L76 -20 H151 L174 21Z" fill="#8fc3d1" /><circle cx="46" cy="137" r="29" fill="#22292d" /><circle cx="176" cy="137" r="29" fill="#22292d" /></g>
      <path d="M560 544 V579 M711 544 V579" stroke="#d6a33e" stroke-width="20" /><path d="M523 579 H749" stroke="#d6a33e" stroke-width="17" />
    </g>

    <!-- Law office / courtroom -->
    <g v-else-if="theme === 'legal'" filter="url(#work-shadow)">
      <g fill="#563d32"><rect x="26" y="234" width="208" height="331" /><rect x="566" y="234" width="208" height="331" /></g><g fill="#b94f49"><rect x="48" y="272" width="32" height="119" /><rect x="91" y="291" width="36" height="100" /><rect x="139" y="257" width="30" height="134" /></g><g fill="#d1ab54"><rect x="586" y="272" width="37" height="119" /><rect x="637" y="255" width="31" height="136" /><rect x="681" y="286" width="42" height="105" /></g>
      <path d="M400 300 V486 M324 346 H476 M349 346 L314 421 H384Z M451 346 L416 421 H486Z" fill="none" stroke="#d9b65c" stroke-width="12" /><path d="M287 421 H411 M389 421 H513" stroke="#d9b65c" stroke-width="9" />
      <rect x="285" y="480" width="230" height="88" rx="8" fill="#765441" /><path d="M350 480 Q400 432 450 480" fill="#8d684d" />
    </g>

    <!-- Poker / casino -->
    <g v-else-if="theme === 'casino'" filter="url(#work-shadow)">
      <rect width="800" height="590" fill="#3f2546" opacity=".55" /><g fill="#e2bb5f"><circle cx="67" cy="86" r="13" /><circle cx="115" cy="86" r="13" /><circle cx="685" cy="86" r="13" /><circle cx="733" cy="86" r="13" /></g>
      <ellipse cx="126" cy="453" rx="105" ry="72" fill="#19705e" stroke="#d7b85f" stroke-width="12" /><g fill="#f1ede4"><rect x="74" y="421" width="36" height="51" rx="5" transform="rotate(-14 74 421)" /><rect x="124" y="415" width="36" height="51" rx="5" transform="rotate(10 124 415)" /></g><g fill="#d55256"><circle cx="73" cy="497" r="17" /><circle cx="107" cy="510" r="17" /><circle cx="145" cy="500" r="17" /></g>
      <rect x="584" y="250" width="177" height="303" rx="18" fill="#d9a349" stroke="#6c4352" stroke-width="12" /><rect x="607" y="291" width="131" height="113" rx="9" fill="#242640" /><text x="672" y="370" fill="#f5d45e" font-size="59" font-weight="800" text-anchor="middle">777</text><circle cx="672" cy="467" r="43" fill="#c94f58" />
    </g>

    <!-- Film studio -->
    <g v-else-if="theme === 'film'" filter="url(#work-shadow)">
      <rect width="800" height="590" fill="#393b48" opacity=".5" />
      <g stroke="#30343a" stroke-width="10"><path d="M80 330 V562 M80 482 L31 562 M80 482 L130 562" /><path d="M714 324 V562 M714 482 L662 562 M714 482 L766 562" /></g><path d="M31 251 L137 284 L105 374 L0 341Z" fill="#efe3bd" stroke="#4e5157" stroke-width="9" /><path d="M660 282 L768 247 L800 338 L692 373Z" fill="#efe3bd" stroke="#4e5157" stroke-width="9" />
      <g transform="translate(568 412)"><rect width="127" height="92" rx="12" fill="#20252d" /><circle cx="70" cy="47" r="30" fill="#678294" stroke="#0f1419" stroke-width="11" /><path d="M127 25 L179 4 V88 L127 68Z" fill="#20252d" /><path d="M64 92 V144 M64 115 L22 159 M64 115 L106 159" stroke="#20252d" stroke-width="11" /></g>
      <g transform="translate(64 419)"><rect width="152" height="103" rx="7" fill="#f3eee0" /><path d="M0 31 H152 M18 0 L45 31 M60 0 L87 31 M102 0 L129 31" stroke="#222933" stroke-width="12" /></g>
    </g>

    <!-- Government chamber -->
    <g v-else-if="theme === 'government'" filter="url(#work-shadow)">
      <rect width="800" height="590" fill="#d8d1bd" opacity=".52" /><g fill="#8e4a4d"><rect x="26" y="193" width="63" height="371" /><rect x="711" y="193" width="63" height="371" /></g><g fill="#e7ddc7"><rect x="40" y="214" width="35" height="350" /><rect x="725" y="214" width="35" height="350" /></g>
      <path d="M274 285 L400 211 L526 285Z" fill="#f0e8d5" stroke="#9e8f76" stroke-width="8" /><rect x="307" y="285" width="186" height="163" fill="#c4b69e" /><g fill="#eee5d3"><rect x="329" y="285" width="31" height="163" /><rect x="384" y="285" width="31" height="163" /><rect x="439" y="285" width="31" height="163" /></g>
      <rect x="548" y="420" width="207" height="145" rx="8" fill="#714f3e" /><path d="M579 420 Q651 362 724 420" fill="#8e684d" /><circle cx="651" cy="456" r="27" fill="#d5b358" /><path d="M651 482 V525" stroke="#d5b358" stroke-width="8" />
      <path d="M115 246 V548" stroke="#5b4538" stroke-width="11" /><path d="M120 258 H225 V335 H120Z" fill="#345d91" /><path d="M120 335 H225 V406 H120Z" fill="#f0eee5" /><path d="M120 406 H225 V479 H120Z" fill="#b84d51" />
    </g>

    <!-- Rideshare/car interior -->
    <g v-else-if="theme === 'driving'" filter="url(#work-shadow)">
      <rect width="800" height="590" fill="#28343d" /><path d="M98 72 H702 L765 401 H35Z" fill="url(#work-window)" stroke="#182229" stroke-width="18" /><path d="M400 83 V382" stroke="#29383f" stroke-width="12" /><path d="M35 397 H765 V590 H35Z" fill="#39464d" />
      <path d="M111 401 Q213 301 318 401 M482 401 Q589 301 693 401" fill="#313a3e" stroke="#20282d" stroke-width="12" /><circle cx="607" cy="485" r="82" fill="none" stroke="#171e22" stroke-width="18" /><circle cx="607" cy="485" r="20" fill="#171e22" /><path d="M607 465 V403 M590 493 L536 525 M624 493 L679 525" stroke="#171e22" stroke-width="15" />
      <rect x="104" y="439" width="245" height="96" rx="15" fill="#65747b" /><circle cx="146" cy="487" r="24" fill="#24313a" /><path d="M188 474 H322 M188 503 H285" stroke="#a5c8d3" stroke-width="9" />
    </g>

    <!-- Creative marketing agency -->
    <g v-else-if="theme === 'marketing'" filter="url(#work-shadow)">
      <rect x="25" y="231" width="213" height="318" rx="10" fill="#ece6d8" stroke="#6f6255" stroke-width="9" /><g transform="translate(47 260)"><rect width="67" height="58" fill="#d6615b" transform="rotate(-7)" /><rect x="89" y="10" width="75" height="66" fill="#e1b752" transform="rotate(6)" /><rect x="12" y="104" width="79" height="72" fill="#5d9ab0" transform="rotate(4)" /><rect x="105" y="115" width="62" height="87" fill="#72a06d" transform="rotate(-5)" /></g>
      <rect x="561" y="304" width="216" height="148" rx="10" fill="#263649" /><path d="M590 405 V348 H618 V405 M635 405 V320 H663 V405 M680 405 V365 H708 V405 M725 405 V337 H753 V405" stroke="#66c5a2" stroke-width="18" />
      <rect x="558" y="485" width="220" height="67" rx="9" fill="#6c4e3d" /><g fill="#e9d8a5"><rect x="585" y="503" width="57" height="34" transform="rotate(-5 585 503)" /><rect x="670" y="501" width="70" height="38" transform="rotate(4 670 501)" /></g>
    </g>

    <!-- Science laboratory -->
    <g v-else-if="theme === 'laboratory'" filter="url(#work-shadow)">
      <rect width="800" height="590" fill="#dce8e5" opacity=".5" /><rect x="24" y="403" width="220" height="161" fill="#9aabb0" /><rect x="556" y="403" width="220" height="161" fill="#9aabb0" /><rect x="18" y="387" width="232" height="34" fill="#4c5e64" /><rect x="550" y="387" width="232" height="34" fill="#4c5e64" />
      <g transform="translate(56 273)"><path d="M30 0 V77 L0 130 Q-12 153 17 166 H100 Q128 153 116 130 L86 77 V0" fill="#d9eef0" stroke="#526d73" stroke-width="9" /><path d="M9 124 H108 Q117 145 93 151 H25 Q0 145 9 124Z" fill="#6ac7b0" /></g>
      <g transform="translate(608 249)"><path d="M59 0 V139 M21 25 H91 M21 25 Q1 65 21 91 Q42 65 21 25 M91 25 Q70 65 91 91 Q112 65 91 25" fill="none" stroke="#5c6e78" stroke-width="10" /><path d="M27 139 H91" stroke="#5c6e78" stroke-width="13" /></g>
      <g transform="translate(580 442)"><path d="M0 96 H170" stroke="#36454c" stroke-width="13" /><path d="M44 82 Q80 22 127 64" fill="none" stroke="#40525c" stroke-width="18" /><circle cx="122" cy="59" r="22" fill="#7395a4" /><path d="M91 34 L64 0" stroke="#40525c" stroke-width="17" /></g>
    </g>

    <!-- Nonprofit/community centre -->
    <g v-else-if="theme === 'nonprofit'" filter="url(#work-shadow)">
      <rect x="30" y="233" width="198" height="171" rx="10" fill="#f3ead6" stroke="#7b6650" stroke-width="9" /><circle cx="129" cy="302" r="48" fill="#df695e" /><path d="M94 295 Q129 262 164 295 Q173 328 129 356 Q85 328 94 295Z" fill="#f7d8b1" />
      <g fill="#b57a49"><rect x="30" y="453" width="190" height="111" /><rect x="579" y="430" width="191" height="134" /></g><path d="M30 453 L125 405 L220 453 M579 430 L675 382 L770 430" fill="#d4a66e" stroke="#765238" stroke-width="8" />
      <g fill="#f1e4c5"><rect x="65" y="477" width="120" height="45" /><rect x="614" y="458" width="120" height="52" /></g><path d="M86 499 H165 M637 482 H712" stroke="#6ba087" stroke-width="8" />
      <g transform="translate(599 260)"><circle cx="44" cy="40" r="32" fill="#5d8fa6" /><circle cx="100" cy="40" r="32" fill="#d4a64e" /><circle cx="72" cy="85" r="32" fill="#6fa174" /><path d="M44 72 Q72 118 100 72" fill="none" stroke="#f0e5ce" stroke-width="8" /></g>
    </g>

    <!-- Freelance/home office -->
    <g v-else-if="theme === 'remote'" filter="url(#work-shadow)">
      <rect width="800" height="590" fill="#d9cdbb" opacity=".5" /><rect x="27" y="235" width="194" height="329" rx="10" fill="#645044" /><g fill="#e9dec9"><rect x="46" y="256" width="156" height="91" /><rect x="46" y="365" width="156" height="86" /><rect x="46" y="469" width="156" height="76" /></g><g fill="#c95c56"><rect x="65" y="291" width="22" height="56" /><rect x="106" y="391" width="27" height="60" /></g><g fill="#5d8ead"><rect x="91" y="303" width="26" height="44" /><rect x="141" y="400" width="39" height="51" /></g>
      <rect x="548" y="414" width="240" height="48" rx="8" fill="#6c4e3d" /><path d="M578 462 V561 M758 462 V561" stroke="#4b392f" stroke-width="12" /><rect x="589" y="298" width="154" height="122" rx="9" fill="#27374a" /><circle cx="667" cy="345" r="24" fill="#76a6b8" /><path d="M617 387 Q667 354 717 387" fill="#5e8f70" />
      <g transform="translate(590 478)"><path d="M0 0 H76 V45 Q38 70 0 45Z" fill="#f3eee2" /><path d="M76 10 Q108 10 101 36 Q96 55 76 48" fill="none" stroke="#f3eee2" stroke-width="12" /></g>
    </g>
  </svg>
</template>

<style scoped>
.work-backdrop { display: block; width: 100%; height: 100%; }
svg > g { transform-origin: center; animation: workplace-in .35s ease both; }
@keyframes workplace-in { from { opacity: 0; } to { opacity: 1; } }
</style>
