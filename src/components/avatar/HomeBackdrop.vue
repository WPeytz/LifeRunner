<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAvatarStore } from '@/stores/avatar'

type LocationScene =
  | 'home'
  | 'countryside'
  | 'suburb'
  | 'city'
  | 'country'
  | 'community-college'
  | 'university'
  | 'harvard'
  | 'mit'
  | 'trade-school'
  | 'self-study'
  | 'self-coding'
  | 'self-language'
  | 'self-cooking'
  | 'self-music'
  | 'self-photography'

type TradeFocus = '' | 'electrician' | 'plumber' | 'hvac' | 'welder' | 'automotive'

withDefaults(defineProps<{
  scene?: LocationScene
  countryFlag?: string
  tradeFocus?: TradeFocus
}>(), {
  scene: 'home',
  countryFlag: '',
  tradeFocus: '',
})

const avatarStore = useAvatarStore()
const { skinTone, hairColor } = storeToRefs(avatarStore)

const selfStudyScenes: LocationScene[] = [
  'self-study',
  'self-coding',
  'self-language',
  'self-cooking',
  'self-music',
  'self-photography',
]
</script>

<template>
  <svg
    class="home-backdrop"
    viewBox="0 0 800 800"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    :aria-label="scene === 'home' ? 'A family home with two parents' : `A ${scene} environment`"
  >
    <defs>
      <linearGradient id="home-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3b3152" />
        <stop offset="1" stop-color="#241f3b" />
      </linearGradient>
      <linearGradient id="home-window" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f7b267" />
        <stop offset=".55" stop-color="#f4845f" />
        <stop offset="1" stop-color="#6c5b7b" />
      </linearGradient>
      <linearGradient id="home-floor" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#493229" />
        <stop offset="1" stop-color="#2b211f" />
      </linearGradient>
      <filter id="home-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#000" flood-opacity=".28" />
      </filter>
    </defs>

    <g v-if="scene === 'home'" class="scene">
    <!-- Warm living room -->
    <rect width="800" height="610" fill="url(#home-wall)" />
    <rect y="610" width="800" height="190" fill="url(#home-floor)" />
    <path d="M0 635 H800 M0 690 H800 M0 746 H800" stroke="rgba(255,255,255,.05)" stroke-width="3" />
    <path d="M100 610 L45 800 M260 610 L235 800 M540 610 L565 800 M700 610 L755 800" stroke="rgba(255,255,255,.045)" stroke-width="3" />

    <!-- Window and evening neighbourhood -->
    <rect x="270" y="64" width="260" height="232" rx="12" fill="#17182b" stroke="#8b6f62" stroke-width="14" />
    <rect x="285" y="79" width="230" height="202" rx="4" fill="url(#home-window)" />
    <circle cx="458" cy="122" r="31" fill="#ffe2a8" opacity=".9" />
    <path d="M285 225 L342 178 L398 225 L449 193 L515 240 V281 H285Z" fill="#303557" />
    <path d="M307 232 L347 201 L387 232 V281 H307Z M424 235 L462 207 L500 235 V281 H424Z" fill="#202641" />
    <rect x="344" y="201" width="7" height="80" fill="#d5a66f" />
    <path d="M400 79 V281 M285 180 H515" stroke="#8b6f62" stroke-width="10" />
    <path d="M249 56 Q271 33 291 56 V307 Q268 324 249 307Z M509 56 Q531 33 551 56 V307 Q529 324 509 307Z" fill="#6d3f55" />

    <!-- Family details -->
    <g opacity=".78">
      <rect x="62" y="86" width="112" height="94" rx="8" fill="#2b233b" stroke="#c69b67" stroke-width="8" />
      <circle cx="118" cy="123" r="22" fill="#d8a17d" />
      <path d="M82 171 Q89 140 118 140 Q149 140 155 171Z" fill="#d7656f" />
      <rect x="635" y="95" width="102" height="82" rx="8" fill="#2b233b" stroke="#c69b67" stroke-width="8" />
      <circle cx="686" cy="126" r="19" fill="#d8a17d" />
      <path d="M654 169 Q661 143 686 143 Q713 143 719 169Z" fill="#4d7ab7" />
    </g>

    <!-- Sofa -->
    <g filter="url(#home-soft-shadow)">
      <rect x="168" y="418" width="464" height="158" rx="48" fill="#44516f" />
      <rect x="200" y="384" width="400" height="144" rx="45" fill="#52617f" />
      <path d="M400 388 V525" stroke="rgba(255,255,255,.1)" stroke-width="5" />
      <rect x="145" y="455" width="82" height="142" rx="31" fill="#3b4866" />
      <rect x="573" y="455" width="82" height="142" rx="31" fill="#3b4866" />
      <rect x="184" y="555" width="432" height="44" rx="17" fill="#34405d" />
      <path d="M207 588 L197 644 M593 588 L603 644" stroke="#251d25" stroke-width="18" stroke-linecap="round" />
    </g>

    <!-- Parent on the left -->
    <g class="parent parent-left" filter="url(#home-soft-shadow)">
      <ellipse cx="142" cy="663" rx="76" ry="16" fill="rgba(0,0,0,.24)" />
      <path d="M112 466 L153 466 L159 636 L126 636Z" fill="#27324b" />
      <path d="M82 469 L121 469 L112 636 L78 636Z" fill="#27324b" />
      <path d="M76 625 H113 L118 654 Q90 668 64 652Z" fill="#151a27" />
      <path d="M125 625 H160 L171 651 Q146 666 121 653Z" fill="#151a27" />
      <path d="M75 323 Q102 301 132 305 Q162 306 181 333 L169 477 Q127 495 79 475Z" fill="#bd5969" />
      <path d="M82 336 Q59 344 49 407 L43 477" fill="none" :stroke="skinTone" stroke-width="27" stroke-linecap="round" />
      <path d="M173 339 Q193 354 194 413 L198 475" fill="none" :stroke="skinTone" stroke-width="27" stroke-linecap="round" />
      <rect x="108" y="286" width="43" height="45" rx="16" :fill="skinTone" />
      <ellipse cx="129" cy="247" rx="55" ry="64" :fill="skinTone" />
      <path d="M75 248 Q72 178 131 177 Q185 182 181 250 Q159 212 132 215 Q102 224 75 248Z" :fill="hairColor" />
      <circle cx="108" cy="251" r="5" fill="#35241d" />
      <circle cx="149" cy="251" r="5" fill="#35241d" />
      <path d="M114 277 Q130 288 145 276" fill="none" stroke="#994b55" stroke-width="5" stroke-linecap="round" />
    </g>

    <!-- Parent on the right -->
    <g class="parent parent-right" filter="url(#home-soft-shadow)">
      <ellipse cx="658" cy="663" rx="76" ry="16" fill="rgba(0,0,0,.24)" />
      <path d="M640 466 L679 466 L686 636 L653 636Z" fill="#27324b" />
      <path d="M605 468 L646 468 L638 636 L604 636Z" fill="#27324b" />
      <path d="M601 625 H639 L642 653 Q617 666 590 651Z" fill="#151a27" />
      <path d="M653 625 H687 L699 651 Q674 667 649 653Z" fill="#151a27" />
      <path d="M598 325 Q624 302 655 305 Q687 307 706 334 L693 478 Q653 494 604 476Z" fill="#4d7ab7" />
      <path d="M604 338 Q582 351 579 414 L576 475" fill="none" :stroke="skinTone" stroke-width="27" stroke-linecap="round" />
      <path d="M699 340 Q720 355 726 412 L730 473" fill="none" :stroke="skinTone" stroke-width="27" stroke-linecap="round" />
      <rect x="631" y="286" width="43" height="45" rx="16" :fill="skinTone" />
      <ellipse cx="653" cy="247" rx="55" ry="64" :fill="skinTone" />
      <path d="M598 246 Q601 181 655 178 Q709 183 708 248 Q683 213 655 214 Q625 219 598 246Z" fill="#4c342b" />
      <circle cx="632" cy="251" r="5" fill="#35241d" />
      <circle cx="674" cy="251" r="5" fill="#35241d" />
      <path d="M638 277 Q653 288 669 276" fill="none" stroke="#994b55" stroke-width="5" stroke-linecap="round" />
    </g>

    <rect width="800" height="800" fill="url(#home-window)" opacity=".035" />
    </g>

    <!-- Countryside -->
    <g v-else-if="scene === 'countryside'" class="scene">
      <rect width="800" height="800" fill="#8dc4d5" />
      <circle cx="650" cy="118" r="66" fill="#ffe7a0" opacity=".92" />
      <path d="M0 360 Q150 185 310 355 Q470 170 800 372 V800 H0Z" fill="#6f956c" />
      <path d="M0 430 Q210 280 400 430 Q590 274 800 426 V800 H0Z" fill="#4f7956" />
      <path d="M0 565 Q170 486 340 548 Q515 470 800 560 V800 H0Z" fill="#86a95e" />
      <path d="M320 472 L480 472 L480 628 L320 628Z" fill="#e6d0a4" stroke="#6f513d" stroke-width="8" />
      <path d="M286 478 L400 383 L514 478Z" fill="#9b4e3d" />
      <rect x="375" y="530" width="52" height="98" fill="#6b4939" />
      <rect x="337" y="505" width="38" height="43" fill="#b8dded" stroke="#6f513d" stroke-width="6" />
      <rect x="439" y="505" width="38" height="43" fill="#b8dded" stroke="#6f513d" stroke-width="6" />
      <g fill="#2f6144">
        <circle cx="105" cy="435" r="70" /><circle cx="172" cy="452" r="58" /><circle cx="683" cy="430" r="72" /><circle cx="741" cy="467" r="58" />
      </g>
      <g stroke="#694936" stroke-width="18"><path d="M113 450 V636" /><path d="M694 447 V636" /></g>
      <path d="M0 640 H800" stroke="#e5d4a2" stroke-width="18" />
      <path d="M0 607 H800 M65 586 V675 M190 586 V675 M610 586 V675 M735 586 V675" stroke="#f0dfb3" stroke-width="10" />
      <path d="M314 800 Q335 626 400 620 Q466 626 490 800Z" fill="#c2ad7d" />
    </g>

    <!-- Suburb -->
    <g v-else-if="scene === 'suburb'" class="scene">
      <rect width="800" height="800" fill="#9dcce1" />
      <circle cx="675" cy="110" r="54" fill="#ffe6a3" />
      <rect y="470" width="800" height="330" fill="#75a765" />
      <g filter="url(#home-soft-shadow)">
        <path d="M36 438 L174 315 L312 438Z" fill="#8f4b4c" />
        <rect x="64" y="430" width="220" height="188" fill="#ead7bc" />
        <rect x="107" y="474" width="52" height="62" fill="#a7d3e5" stroke="#76594b" stroke-width="7" />
        <rect x="201" y="474" width="52" height="62" fill="#a7d3e5" stroke="#76594b" stroke-width="7" />
        <rect x="160" y="530" width="52" height="88" fill="#72513f" />
        <path d="M487 432 L622 322 L760 432Z" fill="#555f7b" />
        <rect x="512" y="425" width="220" height="193" fill="#d6dbe1" />
        <rect x="546" y="476" width="55" height="62" fill="#a7d3e5" stroke="#586170" stroke-width="7" />
        <rect x="647" y="476" width="55" height="62" fill="#a7d3e5" stroke="#586170" stroke-width="7" />
        <rect x="607" y="530" width="52" height="88" fill="#4d586b" />
      </g>
      <g fill="#3e7652"><circle cx="25" cy="468" r="62" /><circle cx="350" cy="481" r="55" /><circle cx="782" cy="469" r="62" /></g>
      <path d="M0 634 H800 V800 H0Z" fill="#48505b" />
      <path d="M0 650 H800" stroke="#d9d7cc" stroke-width="13" />
      <path d="M0 734 H800" stroke="#f5e5a1" stroke-width="7" stroke-dasharray="48 35" />
      <path d="M300 634 Q340 566 400 566 Q460 566 500 634Z" fill="#d0c6af" />
      <g transform="translate(88 661)"><rect width="145" height="48" rx="18" fill="#4f78a8" /><path d="M34 0 Q53 -38 98 -38 Q126 -36 137 0Z" fill="#6795c5" /><circle cx="34" cy="48" r="17" fill="#202735" /><circle cx="113" cy="48" r="17" fill="#202735" /></g>
    </g>

    <!-- New city -->
    <g v-else-if="scene === 'city'" class="scene">
      <rect width="800" height="800" fill="#25345b" />
      <circle cx="652" cy="105" r="55" fill="#f7b267" opacity=".72" />
      <path d="M0 255 H110 V620 H0Z M103 176 H232 V620 H103Z M226 290 H330 V620 H226Z M318 112 H465 V620 H318Z M454 235 H577 V620 H454Z M566 158 H707 V620 H566Z M695 274 H800 V620 H695Z" fill="#18233e" />
      <g fill="#f7d58b" opacity=".78">
        <path d="M128 214 H154 V240 H128Z M178 214 H204 V240 H178Z M128 270 H154 V296 H128Z M178 270 H204 V296 H178Z M350 158 H378 V188 H350Z M407 158 H435 V188 H407Z M350 218 H378 V248 H350Z M407 218 H435 V248 H407Z M595 205 H624 V234 H595Z M651 205 H680 V234 H651Z M595 268 H624 V297 H595Z M651 268 H680 V297 H651Z" />
      </g>
      <rect y="600" width="800" height="200" fill="#303744" />
      <path d="M0 624 H800" stroke="#aeb4bd" stroke-width="14" />
      <path d="M0 718 H800" stroke="#f6d66f" stroke-width="7" stroke-dasharray="55 38" />
      <g transform="translate(530 645)"><rect width="178" height="57" rx="18" fill="#c94e5d" /><path d="M42 0 Q64 -45 119 -45 Q151 -43 166 0Z" fill="#dc6874" /><circle cx="42" cy="57" r="19" fill="#151b27" /><circle cx="137" cy="57" r="19" fill="#151b27" /></g>
      <g stroke="#131b31" stroke-width="9"><path d="M75 350 V620 M750 340 V620" /></g>
      <g fill="#f8d992"><circle cx="75" cy="354" r="22" /><circle cx="750" cy="344" r="22" /></g>
    </g>

    <!-- New country -->
    <g v-else-if="scene === 'country'" class="scene">
      <rect width="800" height="800" fill="#72b6cf" />
      <circle cx="664" cy="118" r="64" fill="#ffdf8d" />
      <path d="M0 455 Q110 338 225 454 Q330 300 470 455 Q625 312 800 449 V800 H0Z" fill="#527c70" />
      <path d="M0 535 Q165 446 334 532 Q509 422 800 530 V800 H0Z" fill="#7aa271" />
      <path d="M0 628 Q250 574 424 623 Q612 567 800 620 V800 H0Z" fill="#d6be83" />
      <path d="M400 800 Q392 600 400 466" stroke="#5f6c75" stroke-width="105" />
      <path d="M400 800 Q394 604 400 466" stroke="#f3e6b7" stroke-width="8" stroke-dasharray="36 30" />
      <g transform="translate(108 380)"><path d="M0 52 H143 V142 H0Z" fill="#e8ddd0" /><path d="M-18 55 L72 0 L161 55Z" fill="#bb5b4b" /><rect x="57" y="82" width="34" height="60" fill="#675046" /></g>
      <g transform="translate(575 365)"><path d="M0 142 Q23 84 50 142Z" fill="#d7d0bd" /><path d="M50 142 Q80 46 110 142Z" fill="#eee7d6" /><path d="M110 142 Q135 78 162 142Z" fill="#d7d0bd" /></g>
      <g fill="#2f694a"><circle cx="66" cy="500" r="56" /><circle cx="734" cy="500" r="58" /></g>
      <g stroke="#5e4434" stroke-width="16"><path d="M66 514 V641 M734 514 V641" /></g>
      <path d="M111 168 Q219 114 326 174 L295 183 L263 215 L238 185 L176 189Z" fill="#f5f2e9" stroke="#54657b" stroke-width="6" />
      <path d="M215 181 L191 223 L235 193" fill="#f5f2e9" stroke="#54657b" stroke-width="6" />
      <path d="M105 250 Q400 183 695 250" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="5" stroke-dasharray="3 17" />
      <g transform="translate(570 575)"><rect width="112" height="70" rx="8" fill="#8a5d48" /><path d="M26 0 Q27 -28 56 -28 Q85 -28 86 0" fill="none" stroke="#d1ab72" stroke-width="8" /><path d="M56 0 V70" stroke="#d1ab72" stroke-width="5" /></g>
      <g v-if="countryFlag" class="country-flag" filter="url(#home-soft-shadow)">
        <path d="M530 218 V513" stroke="#604735" stroke-width="13" stroke-linecap="round" />
        <rect x="522" y="505" width="74" height="17" rx="8" fill="#604735" />
        <text x="532" y="278" font-size="94" text-anchor="start">{{ countryFlag }}</text>
      </g>
    </g>

    <!-- Self study room. The furnishings change with the chosen focus. -->
    <g v-else-if="selfStudyScenes.includes(scene)" class="scene">
      <rect width="800" height="800" fill="#d7cbb9" />
      <rect y="574" width="800" height="226" fill="#765a47" />
      <path d="M0 625 H800 M0 690 H800 M0 755 H800 M88 574 L65 800 M244 574 L230 800 M556 574 L570 800 M712 574 L735 800" stroke="#604534" stroke-width="5" opacity=".42" />

      <!-- Window and unmistakable interior framing -->
      <rect x="276" y="62" width="248" height="222" rx="8" fill="#edf4f2" stroke="#6f5749" stroke-width="14" />
      <rect x="291" y="77" width="218" height="192" fill="#87bfd3" />
      <circle cx="456" cy="117" r="32" fill="#ffe09a" />
      <path d="M291 232 Q350 170 408 229 Q464 173 509 218 V269 H291Z" fill="#6f9a70" />
      <path d="M400 77 V269 M291 173 H509" stroke="#6f5749" stroke-width="9" />
      <path d="M254 52 Q277 30 297 52 V299 Q275 313 254 299Z M503 52 Q525 30 546 52 V299 Q525 313 503 299Z" fill="#b65e55" />
      <rect x="0" y="552" width="800" height="26" fill="#594439" />
      <ellipse cx="400" cy="744" rx="202" ry="52" fill="#c2a785" opacity=".72" />

      <!-- Shared shelves and learning supplies -->
      <g filter="url(#home-soft-shadow)">
        <rect x="28" y="262" width="176" height="320" rx="9" fill="#5f493d" />
        <rect x="42" y="279" width="148" height="88" fill="#e5d8c5" />
        <rect x="42" y="382" width="148" height="86" fill="#e5d8c5" />
        <rect x="42" y="483" width="148" height="83" fill="#e5d8c5" />
        <g fill="#d95f59"><rect x="55" y="308" width="18" height="59" /><rect x="121" y="410" width="22" height="58" /></g>
        <g fill="#5084a8"><rect x="76" y="321" width="22" height="46" /><rect x="147" y="419" width="26" height="49" /><rect x="64" y="513" width="25" height="53" /></g>
        <g fill="#d3a74e"><rect x="102" y="298" width="18" height="69" /><rect x="96" y="427" width="20" height="41" /><rect x="95" y="525" width="49" height="12" /><rect x="95" y="543" width="61" height="12" /></g>
      </g>

      <!-- Coding: dual screens, code, keyboard and router -->
      <g v-if="scene === 'self-coding'" filter="url(#home-soft-shadow)">
        <rect x="566" y="355" width="210" height="166" rx="12" fill="#57483f" />
        <rect x="585" y="258" width="176" height="117" rx="8" fill="#20283a" stroke="#48566e" stroke-width="8" />
        <path d="M607 287 H677 M607 311 H714 M607 335 H657" stroke="#62d6a4" stroke-width="8" stroke-linecap="round" />
        <path d="M685 287 H733 M726 311 H742 M669 335 H722" stroke="#e7bc61" stroke-width="8" stroke-linecap="round" />
        <path d="M673 375 V402 M638 402 H708" stroke="#354052" stroke-width="10" />
        <rect x="615" y="421" width="115" height="25" rx="6" fill="#d5d9db" />
        <g fill="#6f7a81"><circle cx="736" cy="488" r="5" /><circle cx="750" cy="488" r="5" /></g>
        <path d="M735 472 Q743 461 751 472 M729 464 Q743 446 757 464" fill="none" stroke="#71c8e2" stroke-width="4" />
      </g>

      <!-- Language: map, phrase cards and travel books -->
      <g v-else-if="scene === 'self-language'" filter="url(#home-soft-shadow)">
        <rect x="565" y="210" width="205" height="164" rx="10" fill="#f3ebd8" stroke="#8f6d54" stroke-width="9" />
        <path d="M591 268 Q607 229 644 249 L674 235 L700 263 L746 249 L738 321 L697 342 L667 313 L633 333 L596 312Z" fill="#73a579" />
        <path d="M582 399 H678 Q698 399 698 419 V468 Q698 488 678 488 H638 L612 514 V488 H582 Q562 488 562 468 V419 Q562 399 582 399Z" fill="#f6f0e5" stroke="#5e7590" stroke-width="7" />
        <text x="630" y="438" fill="#43546b" font-size="22" font-weight="800" text-anchor="middle">HOLA · BONJOUR</text>
        <text x="630" y="466" fill="#b45c58" font-size="20" font-weight="700" text-anchor="middle">你好 · CIAO</text>
        <g transform="translate(697 414)"><rect width="68" height="95" rx="5" fill="#517fa2" /><path d="M12 21 H56 M12 38 H48 M12 55 H53" stroke="#e9d998" stroke-width="5" /></g>
      </g>

      <!-- Cooking: home kitchen, utensils and ingredients -->
      <g v-else-if="scene === 'self-cooking'" filter="url(#home-soft-shadow)">
        <rect x="544" y="250" width="238" height="311" rx="8" fill="#e8dfcf" />
        <g fill="#8eaa9f" stroke="#627a72" stroke-width="6"><rect x="559" y="267" width="94" height="82" /><rect x="673" y="267" width="94" height="82" /></g>
        <rect x="554" y="375" width="218" height="34" fill="#594c46" />
        <rect x="572" y="409" width="184" height="146" fill="#bfaa90" />
        <rect x="608" y="433" width="116" height="105" rx="7" fill="#48525a" />
        <g fill="#232a30"><circle cx="635" cy="458" r="12" /><circle cx="697" cy="458" r="12" /></g>
        <rect x="623" y="477" width="87" height="48" rx="4" fill="#8998a0" />
        <path d="M581 230 V324 M606 230 V324 M631 230 V324" stroke="#5b6162" stroke-width="7" stroke-linecap="round" />
        <path d="M569 226 Q581 211 593 226 M595 226 Q606 205 618 226 M620 226 Q631 209 643 226" fill="none" stroke="#5b6162" stroke-width="7" />
        <g transform="translate(666 386)"><circle cx="0" cy="0" r="16" fill="#d94f48" /><circle cx="35" cy="0" r="16" fill="#e1b449" /><path d="M18 -7 Q26 -31 44 -23" fill="none" stroke="#4d8050" stroke-width="7" /></g>
      </g>

      <!-- Music: keyboard, guitar, speaker and notes -->
      <g v-else-if="scene === 'self-music'" filter="url(#home-soft-shadow)">
        <rect x="554" y="398" width="225" height="67" rx="12" fill="#313541" />
        <g fill="#f4f1e8"><rect x="568" y="411" width="24" height="43" /><rect x="596" y="411" width="24" height="43" /><rect x="624" y="411" width="24" height="43" /><rect x="652" y="411" width="24" height="43" /><rect x="680" y="411" width="24" height="43" /><rect x="708" y="411" width="24" height="43" /><rect x="736" y="411" width="24" height="43" /></g>
        <g fill="#181b22"><rect x="586" y="411" width="14" height="27" /><rect x="614" y="411" width="14" height="27" /><rect x="670" y="411" width="14" height="27" /><rect x="698" y="411" width="14" height="27" /><rect x="726" y="411" width="14" height="27" /></g>
        <path d="M585 465 L570 555 M748 465 L766 555" stroke="#383138" stroke-width="10" />
        <g transform="translate(627 205)"><path d="M49 26 V196" stroke="#694733" stroke-width="18" /><path d="M49 31 L75 0" stroke="#694733" stroke-width="17" /><ellipse cx="49" cy="183" rx="52" ry="70" fill="#c98241" /><circle cx="49" cy="171" r="19" fill="#4e352b" /><path d="M49 30 V215" stroke="#ecd38d" stroke-width="4" /></g>
        <rect x="555" y="269" width="65" height="98" rx="8" fill="#343945" /><circle cx="588" cy="305" r="19" fill="#777f8b" /><circle cx="588" cy="345" r="12" fill="#777f8b" />
        <g fill="#b04f66" font-size="43" font-weight="800"><text x="713" y="260">♪</text><text x="751" y="326">♫</text></g>
      </g>

      <!-- Photography: studio lights, camera, tripod and prints -->
      <g v-else-if="scene === 'self-photography'" filter="url(#home-soft-shadow)">
        <g stroke="#4c5159" stroke-width="8"><path d="M615 335 V559 M615 489 L572 559 M615 489 L658 559" /><path d="M738 355 V559 M738 489 L701 559 M738 489 L778 559" /></g>
        <path d="M573 281 L648 314 L618 373 L543 340Z" fill="#f5e7c8" stroke="#5e6166" stroke-width="8" />
        <path d="M697 306 L767 273 L794 333 L724 366Z" fill="#f5e7c8" stroke="#5e6166" stroke-width="8" />
        <g transform="translate(640 389)"><rect width="104" height="73" rx="12" fill="#303740" /><circle cx="56" cy="37" r="25" fill="#708ca0" stroke="#161c22" stroke-width="9" /><rect x="17" y="-15" width="36" height="20" rx="5" fill="#303740" /><circle cx="88" cy="14" r="6" fill="#d55252" /></g>
        <path d="M692 462 V545 M692 488 L651 556 M692 488 L734 556" stroke="#3f454d" stroke-width="10" />
        <g stroke="#765947" stroke-width="8"><rect x="555" y="176" width="87" height="72" fill="#8fc1d0" /><rect x="665" y="163" width="100" height="82" fill="#d6a26c" /></g>
        <path d="M565 236 L594 203 L617 226 L632 211 V240Z" fill="#4f7b67" /><circle cx="715" cy="201" r="24" fill="#f4d180" />
      </g>

      <!-- Generic self-study setup before a focus is picked -->
      <g v-else filter="url(#home-soft-shadow)">
        <rect x="553" y="390" width="221" height="42" rx="8" fill="#664c3c" />
        <path d="M577 432 V558 M750 432 V558" stroke="#4b392f" stroke-width="12" />
        <path d="M586 368 Q641 338 690 372 Q724 346 752 363 V408 Q717 392 689 411 Q638 381 586 402Z" fill="#f5ebcf" stroke="#9a744d" stroke-width="6" />
        <rect x="629" y="256" width="88" height="79" rx="8" fill="#e8d769" />
        <path d="M648 278 H700 M648 298 H687 M648 317 H695" stroke="#8a7240" stroke-width="5" />
      </g>
    </g>

    <!-- Community college campus -->
    <g v-else-if="scene === 'community-college'" class="scene">
      <rect width="800" height="800" fill="#9dcfe0" />
      <circle cx="670" cy="105" r="58" fill="#ffe19a" />
      <rect y="510" width="800" height="290" fill="#719c63" />
      <g filter="url(#home-soft-shadow)">
        <rect x="54" y="270" width="692" height="314" rx="8" fill="#a95743" />
        <rect x="54" y="270" width="692" height="38" fill="#7f3d34" />
        <path d="M54 356 H746 M54 447 H746 M130 270 V584 M272 270 V584 M528 270 V584 M670 270 V584" stroke="rgba(81,38,34,.34)" stroke-width="5" />
        <rect x="304" y="338" width="192" height="246" fill="#e0d4bc" />
        <rect x="338" y="395" width="124" height="189" fill="#52768d" stroke="#3f5564" stroke-width="9" />
        <path d="M400 395 V584" stroke="#b9d4df" stroke-width="6" />
        <g fill="#acd6e7" stroke="#e3d8c1" stroke-width="8">
          <rect x="90" y="332" width="92" height="62" /><rect x="202" y="332" width="72" height="62" />
          <rect x="526" y="332" width="72" height="62" /><rect x="618" y="332" width="92" height="62" />
          <rect x="90" y="430" width="92" height="62" /><rect x="202" y="430" width="72" height="62" />
          <rect x="526" y="430" width="72" height="62" /><rect x="618" y="430" width="92" height="62" />
        </g>
        <rect x="205" y="218" width="390" height="76" rx="12" fill="#f4efe3" stroke="#7f3d34" stroke-width="9" />
        <text x="400" y="267" fill="#66382f" font-size="31" font-weight="800" text-anchor="middle" letter-spacing="3">COMMUNITY COLLEGE</text>
      </g>
      <path d="M292 800 Q318 603 400 583 Q482 603 508 800Z" fill="#c8c2b0" />
      <g fill="#356744"><circle cx="54" cy="505" r="68" /><circle cx="751" cy="509" r="72" /></g>
      <g stroke="#644735" stroke-width="18"><path d="M54 522 V665" /><path d="M750 524 V665" /></g>
      <g transform="translate(93 635)" stroke="#3e4650" stroke-width="10" stroke-linecap="round" fill="none"><path d="M0 40 H116 M14 0 H103 M23 0 V40 M94 0 V40" /></g>
      <g transform="translate(608 628)" fill="none" stroke="#334151" stroke-width="8"><circle cx="24" cy="55" r="24" /><circle cx="103" cy="55" r="24" /><path d="M24 55 L52 10 L78 55 H24 L61 55 L103 55 L76 8 H51" /></g>
    </g>

    <!-- University quad -->
    <g v-else-if="scene === 'university'" class="scene">
      <rect width="800" height="800" fill="#86bad0" />
      <circle cx="662" cy="102" r="58" fill="#ffe39b" />
      <rect y="518" width="800" height="282" fill="#608d57" />
      <g filter="url(#home-soft-shadow)">
        <rect x="90" y="302" width="620" height="284" fill="#d9d1bf" />
        <path d="M64 315 L400 151 L736 315Z" fill="#e6dfcf" stroke="#b1a58e" stroke-width="9" />
        <path d="M267 218 Q400 69 533 218Z" fill="#647a91" stroke="#4d6177" stroke-width="8" />
        <circle cx="400" cy="176" r="44" fill="#d8e8ec" stroke="#b1a58e" stroke-width="9" />
        <path d="M400 131 V221 M355 176 H445" stroke="#8195a1" stroke-width="6" />
        <rect x="136" y="330" width="528" height="256" fill="#b24f42" />
        <g fill="#d7cdb7" stroke="#9c927f" stroke-width="5">
          <rect x="164" y="322" width="38" height="264" /><rect x="228" y="322" width="38" height="264" />
          <rect x="534" y="322" width="38" height="264" /><rect x="598" y="322" width="38" height="264" />
        </g>
        <rect x="298" y="347" width="204" height="239" fill="#e6dfcf" />
        <path d="M285 349 L400 282 L515 349Z" fill="#eee8da" stroke="#9c927f" stroke-width="7" />
        <rect x="349" y="466" width="102" height="120" fill="#4f6678" stroke="#344a5c" stroke-width="9" />
        <text x="400" y="333" fill="#5d443c" font-size="25" font-weight="800" text-anchor="middle" letter-spacing="4">UNIVERSITY</text>
      </g>
      <path d="M290 800 Q313 622 400 584 Q487 622 510 800Z" fill="#c9c2af" />
      <g fill="#315f40"><circle cx="68" cy="489" r="82" /><circle cx="744" cy="491" r="82" /></g>
      <g stroke="#5a4031" stroke-width="19"><path d="M68 504 V675" /><path d="M744 506 V675" /></g>
      <g transform="translate(648 190)"><path d="M0 0 H58 V130 H0Z" fill="#7e2836" /><path d="M0 94 L29 112 L58 94 V130 H0Z" fill="#e7c566" /><text x="29" y="69" fill="#fff" font-size="34" font-weight="800" text-anchor="middle">U</text></g>
    </g>

    <!-- Harvard Yard: revealed only after admission -->
    <g v-else-if="scene === 'harvard'" class="scene">
      <rect width="800" height="800" fill="#91bed0" />
      <circle cx="665" cy="103" r="58" fill="#ffe09a" />
      <rect y="548" width="800" height="252" fill="#628257" />
      <g filter="url(#home-soft-shadow)">
        <!-- Historic red-brick hall and clock tower -->
        <rect x="76" y="300" width="648" height="302" fill="#a53f39" />
        <path d="M55 316 L183 229 L298 316Z M502 316 L617 229 L745 316Z" fill="#77403d" />
        <rect x="296" y="220" width="208" height="382" fill="#b3473e" />
        <path d="M276 231 L400 134 L524 231Z" fill="#713b39" />
        <rect x="350" y="158" width="100" height="112" fill="#e6dcc4" stroke="#8f3d38" stroke-width="9" />
        <circle cx="400" cy="210" r="33" fill="#f6f0de" stroke="#8b6e5a" stroke-width="7" />
        <path d="M400 185 V210 L419 222" fill="none" stroke="#59483f" stroke-width="6" stroke-linecap="round" />
        <path d="M381 134 L400 97 L419 134Z" fill="#d9b45b" />
        <g fill="#dce8e7" stroke="#eadfc8" stroke-width="8">
          <rect x="112" y="352" width="63" height="80" /><rect x="202" y="352" width="63" height="80" />
          <rect x="535" y="352" width="63" height="80" /><rect x="625" y="352" width="63" height="80" />
          <rect x="111" y="469" width="63" height="83" /><rect x="626" y="469" width="63" height="83" />
        </g>
        <g fill="#e8deca" stroke="#8b3534" stroke-width="7">
          <rect x="326" y="314" width="45" height="288" /><rect x="429" y="314" width="45" height="288" />
        </g>
        <path d="M363 602 V439 Q400 393 437 439 V602Z" fill="#403c3b" stroke="#e9dfcb" stroke-width="9" />
        <rect x="311" y="275" width="178" height="56" rx="7" fill="#f0e6d2" />
        <text x="400" y="313" fill="#8f292f" font-size="31" font-weight="900" text-anchor="middle" letter-spacing="5">HARVARD</text>
      </g>
      <!-- Harvard Yard path and gates -->
      <path d="M264 800 Q300 642 400 601 Q500 642 536 800Z" fill="#b9ae99" />
      <g fill="#315d3f"><circle cx="55" cy="473" r="85" /><circle cx="752" cy="474" r="86" /></g>
      <g stroke="#594331" stroke-width="21"><path d="M55 487 V681" /><path d="M752 489 V681" /></g>
      <g stroke="#24292c" stroke-width="10" fill="none">
        <path d="M13 606 V800 M180 606 V800 M13 637 H180 M28 637 V800 M57 637 V800 M87 637 V800 M116 637 V800 M146 637 V800" />
        <path d="M620 606 V800 M787 606 V800 M620 637 H787 M635 637 V800 M664 637 V800 M694 637 V800 M723 637 V800 M753 637 V800" />
      </g>
      <g transform="translate(83 187)" filter="url(#home-soft-shadow)"><path d="M0 0 H92 V105 Q46 141 0 105Z" fill="#a51c30" stroke="#f2e5cb" stroke-width="7" /><text x="46" y="79" fill="#fff" font-size="62" font-weight="900" text-anchor="middle">H</text></g>
    </g>

    <!-- MIT: revealed only after admission -->
    <g v-else-if="scene === 'mit'" class="scene">
      <rect width="800" height="800" fill="#85b7cb" />
      <circle cx="664" cy="99" r="57" fill="#ffe19a" />
      <rect y="556" width="800" height="244" fill="#6d8c68" />
      <g filter="url(#home-soft-shadow)">
        <!-- Modern glass-and-concrete campus -->
        <path d="M24 295 L175 215 L301 295 V601 H24Z" fill="#d9d8d2" />
        <path d="M499 295 L625 215 L776 295 V601 H499Z" fill="#ece9df" />
        <rect x="198" y="262" width="404" height="339" fill="#e7e4dc" />
        <path d="M175 262 Q400 75 625 262Z" fill="#b9c2c2" stroke="#758386" stroke-width="10" />
        <path d="M210 261 Q400 116 590 261Z" fill="#d4dddd" />
        <path d="M245 261 Q400 154 555 261Z" fill="#7c9199" />
        <g fill="#82adbb" stroke="#f2eee5" stroke-width="8">
          <rect x="48" y="326" width="94" height="85" /><rect x="166" y="326" width="105" height="85" />
          <rect x="529" y="326" width="105" height="85" /><rect x="658" y="326" width="94" height="85" />
          <rect x="48" y="445" width="94" height="88" /><rect x="658" y="445" width="94" height="88" />
        </g>
        <g fill="#ddd9d0" stroke="#9c9b95" stroke-width="5">
          <rect x="231" y="284" width="38" height="317" /><rect x="289" y="284" width="38" height="317" />
          <rect x="473" y="284" width="38" height="317" /><rect x="531" y="284" width="38" height="317" />
        </g>
        <rect x="340" y="390" width="120" height="211" fill="#4f6e7b" stroke="#2f4854" stroke-width="10" />
        <path d="M400 390 V601" stroke="#aed2dc" stroke-width="7" />
      </g>
      <path d="M275 800 Q303 647 400 600 Q497 647 525 800Z" fill="#c5c1b5" />
      <!-- Abstract engineering sculpture -->
      <g transform="translate(52 430)" fill="none" stroke-linecap="round" filter="url(#home-soft-shadow)">
        <path d="M0 132 L74 0 L148 132 L38 74 H129" stroke="#c5524d" stroke-width="25" />
        <path d="M30 150 L109 35 L161 150" stroke="#303f49" stroke-width="18" />
      </g>
      <!-- Circuit-inspired campus marker -->
      <g transform="translate(594 435)" filter="url(#home-soft-shadow)">
        <rect width="174" height="116" rx="12" fill="#252f37" />
        <path d="M25 24 V91 H55 V24 H83 V91 M108 24 V91 H147 V59 H123" fill="none" stroke="#ed4c4f" stroke-width="14" />
        <circle cx="147" cy="59" r="9" fill="#f3c45d" />
      </g>
      <g transform="translate(71 178)" filter="url(#home-soft-shadow)"><rect width="151" height="67" rx="8" fill="#222b31" /><text x="75" y="47" fill="#ed4c4f" font-size="42" font-weight="900" text-anchor="middle" letter-spacing="5">MIT</text></g>
    </g>

    <!-- Trade school workshop -->
    <g v-else class="scene">
      <rect width="800" height="800" fill="#6f8494" />
      <rect y="535" width="800" height="265" fill="#4d5559" />
      <g filter="url(#home-soft-shadow)">
        <rect x="55" y="206" width="690" height="388" fill="#b7b5aa" />
        <path d="M35 222 L400 101 L765 222Z" fill="#4c5961" stroke="#343e45" stroke-width="11" />
        <rect x="92" y="250" width="616" height="344" fill="#8e9493" />
        <path d="M92 315 H708 M92 382 H708 M92 449 H708 M92 516 H708" stroke="#626b6d" stroke-width="8" />
        <rect x="246" y="304" width="308" height="290" fill="#414b52" stroke="#283238" stroke-width="12" />
        <path d="M400 304 V594" stroke="#77858b" stroke-width="9" />
        <g fill="#a9d4e2" stroke="#59666b" stroke-width="8">
          <rect x="119" y="303" width="91" height="72" /><rect x="590" y="303" width="91" height="72" />
          <rect x="119" y="416" width="91" height="72" /><rect x="590" y="416" width="91" height="72" />
        </g>
        <rect x="190" y="151" width="420" height="82" rx="10" fill="#28363f" stroke="#e0a94f" stroke-width="8" />
        <text x="400" y="202" fill="#f5c96d" font-size="34" font-weight="800" text-anchor="middle" letter-spacing="4">TRADE SCHOOL</text>
      </g>
      <path d="M290 800 Q317 629 400 594 Q483 629 510 800Z" fill="#b4b0a3" />
      <!-- Generic workshop props before a focus is chosen -->
      <g v-if="!tradeFocus" transform="translate(58 596)">
        <rect x="0" y="42" width="205" height="78" rx="10" fill="#bd6f35" />
        <path d="M22 42 V12 H183 V42" fill="none" stroke="#683d29" stroke-width="12" />
        <circle cx="50" cy="82" r="28" fill="#d5d9da" stroke="#596164" stroke-width="9" />
        <path d="M50 54 V110 M22 82 H78" stroke="#596164" stroke-width="8" />
        <rect x="112" y="64" width="68" height="17" rx="8" fill="#f0c75e" />
      </g>
      <g v-if="!tradeFocus" transform="translate(590 570)" stroke-linecap="round">
        <path d="M60 35 V155 M8 78 H112" stroke="#bd6f35" stroke-width="20" />
        <path d="M10 20 L108 118 M108 20 L10 118" stroke="#d9dfe1" stroke-width="15" />
        <circle cx="59" cy="69" r="22" fill="#343d43" />
      </g>

      <!-- Electrician training bay -->
      <g v-if="tradeFocus === 'electrician'" filter="url(#home-soft-shadow)">
        <rect x="50" y="362" width="188" height="242" rx="10" fill="#69777d" stroke="#2e383d" stroke-width="10" />
        <rect x="72" y="390" width="144" height="69" fill="#dce2df" />
        <rect x="72" y="481" width="144" height="73" fill="#dce2df" />
        <g fill="#30383d"><rect x="87" y="407" width="29" height="35" /><rect x="130" y="407" width="29" height="35" /><rect x="173" y="407" width="29" height="35" /><rect x="87" y="499" width="29" height="35" /><rect x="130" y="499" width="29" height="35" /><rect x="173" y="499" width="29" height="35" /></g>
        <path d="M77 354 Q128 311 180 354 M600 367 Q702 305 755 397 Q780 448 716 486" fill="none" stroke="#d34f4e" stroke-width="14" />
        <path d="M106 354 Q155 326 211 370 M579 390 Q675 348 742 422 Q770 470 699 530" fill="none" stroke="#e6c34d" stroke-width="14" />
        <g transform="translate(602 465)"><circle cx="74" cy="74" r="66" fill="none" stroke="#343d42" stroke-width="21" /><circle cx="74" cy="74" r="19" fill="#343d42" /></g>
        <path d="M637 257 L594 345 H643 L610 425 L707 320 H662 L696 257Z" fill="#f4d250" stroke="#624f2b" stroke-width="7" />
      </g>

      <!-- Plumbing training bay -->
      <g v-else-if="tradeFocus === 'plumber'" filter="url(#home-soft-shadow)">
        <g fill="none" stroke="#6a8490" stroke-width="28"><path d="M48 328 V458 H218 V590" /><path d="M752 326 V430 H592 V591" /></g>
        <g fill="#8299a1" stroke="#4a626b" stroke-width="7"><circle cx="48" cy="458" r="31" /><circle cx="752" cy="430" r="31" /></g>
        <rect x="559" y="482" width="219" height="120" rx="14" fill="#e8efec" stroke="#78959b" stroke-width="9" />
        <path d="M610 481 Q609 409 668 409 Q727 409 726 481" fill="none" stroke="#687b7e" stroke-width="13" />
        <circle cx="668" cy="537" r="19" fill="#87b7c8" />
        <g transform="translate(56 610)"><rect width="181" height="82" rx="9" fill="#b97544" /><path d="M28 0 Q29 -35 90 -35 Q152 -35 153 0" fill="none" stroke="#694731" stroke-width="11" /><path d="M45 20 L126 71 M126 20 L45 71" stroke="#d8dcda" stroke-width="14" /></g>
        <path d="M596 274 Q636 234 676 274 M596 274 L648 326 M676 274 L623 327" fill="none" stroke="#d4d9d7" stroke-width="15" stroke-linecap="round" />
      </g>

      <!-- HVAC training bay -->
      <g v-else-if="tradeFocus === 'hvac'" filter="url(#home-soft-shadow)">
        <rect x="38" y="385" width="205" height="220" rx="12" fill="#879599" stroke="#4f5c61" stroke-width="10" />
        <circle cx="141" cy="488" r="73" fill="#5f6d72" stroke="#c4cccb" stroke-width="9" />
        <g fill="#bac4c5"><path d="M141 488 Q101 409 140 408 Q180 409 141 488Z" /><path d="M141 488 Q220 448 220 488 Q220 528 141 488Z" /><path d="M141 488 Q181 567 141 568 Q101 568 141 488Z" /><path d="M141 488 Q62 528 62 488 Q62 448 141 488Z" /></g>
        <circle cx="141" cy="488" r="18" fill="#3e4a4e" />
        <path d="M581 344 H765 V604 H581Z" fill="#c6ccca" stroke="#5c696d" stroke-width="10" />
        <path d="M603 378 H743 M603 410 H743 M603 442 H743 M603 474 H743" stroke="#7c898c" stroke-width="11" />
        <path d="M673 344 V276 H765 V344" fill="none" stroke="#9ba4a4" stroke-width="32" />
        <rect x="605" y="520" width="137" height="61" rx="8" fill="#35464f" /><text x="673" y="561" fill="#79d0c3" font-size="28" font-weight="800" text-anchor="middle">72°</text>
        <g transform="translate(89 258)"><rect width="112" height="73" rx="10" fill="#eef1eb" stroke="#68777b" stroke-width="8" /><circle cx="33" cy="37" r="17" fill="#4f646c" /><text x="76" y="47" fill="#3f565f" font-size="26" font-weight="800" text-anchor="middle">COOL</text></g>
      </g>

      <!-- Welding training bay -->
      <g v-else-if="tradeFocus === 'welder'" filter="url(#home-soft-shadow)">
        <rect x="39" y="499" width="226" height="55" rx="6" fill="#37444a" /><path d="M72 554 V691 M234 554 V691" stroke="#2b353a" stroke-width="15" />
        <path d="M60 475 L135 402 L205 475Z" fill="none" stroke="#bd7240" stroke-width="20" /><path d="M60 475 H219" stroke="#d1d8d8" stroke-width="12" />
        <g stroke="#f4c54f" stroke-width="7" stroke-linecap="round"><path d="M155 467 L122 431 M160 461 L164 412 M169 468 L210 431 M149 476 L101 481 M173 478 L224 487" /></g>
        <path d="M116 329 Q153 281 190 329 L178 408 H128Z" fill="#303b43" stroke="#171f24" stroke-width="9" /><rect x="134" y="326" width="39" height="38" rx="5" fill="#678795" />
        <g transform="translate(594 375)"><rect x="0" y="65" width="57" height="186" rx="25" fill="#3978a1" /><rect x="78" y="45" width="57" height="206" rx="25" fill="#b94c4b" /><path d="M28 65 V29 H107 V45" fill="none" stroke="#d4d9d8" stroke-width="10" /><circle cx="28" cy="22" r="14" fill="#e3bf4d" /><circle cx="107" cy="22" r="14" fill="#e3bf4d" /><path d="M28 250 V285 M106 250 V285 M-7 285 H143" stroke="#343d42" stroke-width="12" /></g>
        <path d="M661 316 Q706 280 749 319" fill="none" stroke="#c85c4f" stroke-width="17" /><path d="M716 316 L682 390" stroke="#d2d8d8" stroke-width="13" />
      </g>

      <!-- Automotive training bay -->
      <g v-else-if="tradeFocus === 'automotive'" filter="url(#home-soft-shadow)">
        <g transform="translate(44 439)"><path d="M0 94 L42 31 H170 L222 94 V158 H0Z" fill="#c45354" /><path d="M61 31 L89 -16 H150 L178 31Z" fill="#8fc3d1" stroke="#536d77" stroke-width="7" /><circle cx="46" cy="158" r="31" fill="#22292d" /><circle cx="180" cy="158" r="31" fill="#22292d" /><rect x="77" y="97" width="70" height="25" rx="10" fill="#e5d6a8" /></g>
        <path d="M67 604 V684 M232 604 V684" stroke="#d7a43e" stroke-width="22" /><path d="M31 684 H269" stroke="#d7a43e" stroke-width="18" />
        <g transform="translate(599 375)"><circle cx="68" cy="68" r="65" fill="#252d31" /><circle cx="68" cy="68" r="30" fill="#b9c1c1" /><circle cx="68" cy="68" r="11" fill="#59666b" /><circle cx="68" cy="211" r="65" fill="#252d31" /><circle cx="68" cy="211" r="30" fill="#b9c1c1" /><circle cx="68" cy="211" r="11" fill="#59666b" /></g>
        <rect x="571" y="617" width="194" height="80" rx="9" fill="#b86b3d" /><g fill="#e5bd53"><rect x="593" y="640" width="45" height="17" rx="7" /><rect x="652" y="640" width="45" height="17" rx="7" /><rect x="711" y="640" width="35" height="17" rx="7" /></g>
        <g transform="translate(92 286)" stroke="#d4d9d8" stroke-width="14" stroke-linecap="round"><path d="M0 0 L86 86 M86 0 L0 86" /><circle cx="43" cy="43" r="16" fill="#354047" /></g>
      </g>

      <g v-if="!tradeFocus" transform="translate(122 159)"><path d="M0 44 L48 0 L96 44 L48 88Z" fill="#e0a94f" /><path d="M25 44 H71 M48 21 V67" stroke="#28363f" stroke-width="10" /></g>
    </g>
  </svg>
</template>

<style scoped>
.home-backdrop {
  display: block;
  width: 100%;
  height: 100%;
}

.scene {
  transform-origin: center;
  animation: scene-in 0.4s ease both;
}

.country-flag {
  animation: flag-in 0.45s ease both;
}

@keyframes scene-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes flag-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
