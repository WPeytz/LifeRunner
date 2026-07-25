<script setup lang="ts">
type LifestyleScene =
  | 'housing-roommates' | 'housing-budget' | 'housing-nice' | 'housing-home'
  | 'transport-walk' | 'transport-public' | 'transport-used' | 'transport-new' | 'transport-luxury'

defineProps<{ scene: LifestyleScene }>()
</script>

<template>
  <svg class="lifestyle-backdrop" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" role="img" :aria-label="`A ${scene} environment`">
    <defs>
      <linearGradient id="life-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7db9d1" /><stop offset="1" stop-color="#d9e6df" /></linearGradient>
      <linearGradient id="life-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#172442" /><stop offset="1" stop-color="#54415d" /></linearGradient>
      <filter id="life-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="11" stdDeviation="11" flood-color="#111827" flood-opacity=".28" /></filter>
    </defs>

    <!-- Shared apartment with roommates -->
    <g v-if="scene === 'housing-roommates'" class="scene">
      <rect width="800" height="590" fill="#c9bca9" /><rect y="590" width="800" height="210" fill="#765b49" />
      <path d="M0 650 H800 M0 716 H800 M105 590 L80 800 M270 590 L258 800 M530 590 L542 800 M695 590 L720 800" stroke="#604535" stroke-width="5" opacity=".45" />
      <rect x="281" y="63" width="238" height="220" fill="#91bfd0" stroke="#6f594c" stroke-width="14" /><path d="M400 70 V276 M288 169 H512" stroke="#6f594c" stroke-width="9" />
      <g filter="url(#life-shadow)">
        <rect x="27" y="310" width="215" height="237" rx="15" fill="#536d7e" /><rect x="51" y="280" width="166" height="178" rx="30" fill="#62839a" /><rect x="37" y="442" width="196" height="105" rx="23" fill="#496274" />
        <rect x="558" y="310" width="215" height="237" rx="15" fill="#875b69" /><rect x="583" y="280" width="165" height="178" rx="30" fill="#a06c7c" /><rect x="568" y="442" width="195" height="105" rx="23" fill="#774e5d" />
        <rect x="284" y="414" width="232" height="50" rx="9" fill="#6c4d3c" /><path d="M309 464 V553 M491 464 V553" stroke="#4d382f" stroke-width="13" />
        <rect x="331" y="331" width="138" height="88" rx="8" fill="#27384a" /><circle cx="400" cy="371" r="25" fill="#78a6ba" /><path d="M355 404 Q400 369 445 404" fill="#5a8a68" />
      </g>
      <g transform="translate(66 155)"><rect width="125" height="88" rx="7" fill="#f0e6d4" stroke="#735b4e" stroke-width="8" /><circle cx="43" cy="37" r="18" fill="#d7a27d" /><circle cx="84" cy="37" r="18" fill="#ba7e60" /><path d="M19 77 Q27 51 44 51 Q60 51 66 77 M61 77 Q67 51 84 51 Q103 51 111 77" fill="#6986a2" /></g>
      <g transform="translate(603 604)" filter="url(#life-shadow)"><path d="M22 0 H124 Q148 0 158 33 L177 90 Q184 119 155 119 Q138 119 126 92 L116 70 H30 L20 92 Q7 119 -10 119 Q-39 119 -32 90 L-14 33 Q-3 0 22 0Z" fill="#313a45" /><circle cx="39" cy="45" r="13" fill="#d05c59" /><circle cx="114" cy="45" r="13" fill="#5f9bbb" /><path d="M71 34 V61 M57 48 H85" stroke="#d9dddc" stroke-width="8" /></g>
      <ellipse cx="400" cy="744" rx="195" ry="42" fill="#392d27" opacity=".28" />
    </g>

    <!-- Budget apartment -->
    <g v-else-if="scene === 'housing-budget'" class="scene">
      <rect width="800" height="600" fill="#b5aa99" /><rect y="600" width="800" height="200" fill="#655246" />
      <path d="M0 609 H800 M0 676 H800 M0 743 H800" stroke="#483a33" stroke-width="5" opacity=".55" />
      <path d="M84 0 V600 M88 146 Q119 174 91 218 M692 0 V600 M690 366 Q653 391 690 430" stroke="#938778" stroke-width="7" />
      <rect x="282" y="72" width="236" height="208" fill="#a5c2cb" stroke="#65584f" stroke-width="13" /><path d="M400 78 V273 M289 174 H511" stroke="#65584f" stroke-width="8" />
      <g filter="url(#life-shadow)">
        <rect x="34" y="442" width="216" height="134" rx="16" fill="#77766d" /><rect x="52" y="410" width="180" height="112" rx="25" fill="#87867b" /><path d="M76 576 V621 M211 576 V621" stroke="#3f3833" stroke-width="13" />
        <rect x="569" y="386" width="203" height="174" rx="8" fill="#9b7650" /><path d="M569 444 H772 M633 386 V560" stroke="#795a3d" stroke-width="7" /><rect x="597" y="411" width="27" height="22" fill="#e0c287" /><rect x="679" y="474" width="48" height="30" fill="#d39a5d" />
        <rect x="552" y="289" width="181" height="89" rx="7" fill="#37434b" /><path d="M579 315 H708 M579 343 H675" stroke="#87aaad" stroke-width="8" />
        <rect x="281" y="466" width="237" height="40" fill="#674d3d" /><path d="M309 506 V577 M489 506 V577" stroke="#49372f" stroke-width="11" />
      </g>
      <path d="M299 458 Q400 410 501 458Z" fill="#e2d8bd" /><path d="M325 459 Q400 434 475 459" fill="none" stroke="#8a745f" stroke-width="5" />
      <g transform="translate(69 259)"><rect width="137" height="99" rx="6" fill="#ddd5c6" stroke="#716155" stroke-width="8" /><path d="M19 22 H117 M19 47 H91 M19 72 H109" stroke="#ad9c85" stroke-width="7" /></g>
      <ellipse cx="400" cy="744" rx="190" ry="41" fill="#332a27" opacity=".3" />
    </g>

    <!-- Nice apartment -->
    <g v-else-if="scene === 'housing-nice'" class="scene">
      <rect width="800" height="800" fill="#d9d6cf" />
      <rect x="0" y="0" width="800" height="415" fill="#253552" /><rect x="25" y="25" width="750" height="365" fill="url(#life-night)" stroke="#151f35" stroke-width="15" />
      <path d="M0 600 H800 V800 H0Z" fill="#9a806b" /><path d="M0 663 H800 M0 728 H800 M110 600 L91 800 M280 600 L270 800 M520 600 L530 800 M690 600 L709 800" stroke="#806753" stroke-width="5" opacity=".5" />
      <path d="M80 390 V232 H164 V390 M155 390 V173 H265 V390 M254 390 V270 H343 V390 M463 390 V213 H557 V390 M548 390 V153 H665 V390 M656 390 V251 H745 V390" fill="#192640" />
      <g fill="#efcf7c" opacity=".8"><path d="M101 263 H125 V289 H101Z M190 205 H216 V233 H190Z M588 188 H616 V217 H588Z M690 282 H715 V308 H690Z" /></g>
      <g filter="url(#life-shadow)">
        <rect x="25" y="431" width="220" height="153" rx="35" fill="#5e7180" /><rect x="53" y="397" width="164" height="131" rx="36" fill="#728996" /><rect x="555" y="431" width="220" height="153" rx="35" fill="#5e7180" /><rect x="583" y="397" width="164" height="131" rx="36" fill="#728996" />
        <rect x="283" y="465" width="234" height="45" rx="12" fill="#6f523f" /><path d="M316 510 V580 M484 510 V580" stroke="#4a382f" stroke-width="12" />
        <rect x="613" y="233" width="117" height="145" rx="58" fill="#d1b064" /><path d="M671 378 V430" stroke="#54463b" stroke-width="10" />
      </g>
      <g transform="translate(61 217)"><path d="M65 176 Q5 136 26 75 Q45 17 105 52 Q147 -8 204 26 Q259 58 229 118 Q209 165 152 142 Q124 202 65 176Z" fill="#4f8a65" /><rect x="98" y="164" width="61" height="70" rx="9" fill="#d5c3a4" /></g>
      <ellipse cx="400" cy="748" rx="203" ry="44" fill="#54483e" opacity=".3" />
    </g>

    <!-- Purchased home -->
    <g v-else-if="scene === 'housing-home'" class="scene">
      <rect width="800" height="800" fill="url(#life-sky)" /><circle cx="676" cy="105" r="57" fill="#ffe09a" /><rect y="536" width="800" height="264" fill="#6f9a64" />
      <g filter="url(#life-shadow)">
        <rect x="99" y="310" width="602" height="307" fill="#e7dbca" /><path d="M62 326 L400 130 L738 326Z" fill="#675367" stroke="#443949" stroke-width="12" />
        <rect x="143" y="349" width="155" height="268" fill="#d7c5ad" /><rect x="502" y="349" width="155" height="268" fill="#d7c5ad" />
        <g fill="#a8d2df" stroke="#6b5d56" stroke-width="9"><rect x="164" y="388" width="112" height="83" /><rect x="524" y="388" width="112" height="83" /><rect x="164" y="500" width="112" height="83" /><rect x="524" y="500" width="112" height="83" /></g>
        <rect x="328" y="352" width="144" height="265" fill="#f0e7d8" /><rect x="357" y="442" width="86" height="175" rx="7" fill="#596e79" /><circle cx="425" cy="530" r="8" fill="#e4c05e" />
        <path d="M292 353 L400 282 L508 353Z" fill="#f3eadc" stroke="#77685f" stroke-width="8" />
      </g>
      <path d="M282 800 Q310 658 400 617 Q490 658 518 800Z" fill="#c5bba6" />
      <g fill="#396a48"><circle cx="57" cy="496" r="77" /><circle cx="747" cy="496" r="77" /></g><g stroke="#5b4030" stroke-width="19"><path d="M57 511 V670" /><path d="M747 511 V670" /></g>
      <g transform="translate(579 638)" filter="url(#life-shadow)"><rect width="161" height="84" rx="7" fill="#e8e2d3" stroke="#4e5d63" stroke-width="8" /><path d="M18 26 H143 M18 52 H115" stroke="#7f8e8f" stroke-width="7" /><path d="M80 84 V135" stroke="#4e5d63" stroke-width="10" /><path d="M35 135 H125" stroke="#4e5d63" stroke-width="10" /></g>
      <ellipse cx="400" cy="755" rx="190" ry="38" fill="#405b3e" opacity=".33" />
    </g>

    <!-- Walking and cycling -->
    <g v-else-if="scene === 'transport-walk'" class="scene">
      <rect width="800" height="800" fill="url(#life-sky)" /><circle cx="671" cy="103" r="58" fill="#ffe29b" />
      <path d="M0 421 Q136 327 273 420 Q407 309 535 420 Q673 323 800 416 V800 H0Z" fill="#5f9364" /><path d="M0 531 Q194 444 392 526 Q579 435 800 524 V800 H0Z" fill="#7cac69" />
      <path d="M292 800 Q322 583 400 529 Q478 583 508 800Z" fill="#d4c9aa" /><path d="M400 800 V544" stroke="#f2ecda" stroke-width="7" stroke-dasharray="32 25" />
      <g fill="#316244"><circle cx="57" cy="418" r="75" /><circle cx="744" cy="420" r="76" /></g><g stroke="#5d4332" stroke-width="18"><path d="M57 433 V638" /><path d="M744 435 V638" /></g>
      <g transform="translate(53 591)" fill="none" stroke="#344454" stroke-width="11" filter="url(#life-shadow)"><circle cx="45" cy="86" r="43" /><circle cx="185" cy="86" r="43" /><path d="M45 86 L94 9 L139 86 H45 L112 86 L185 86 L138 5 H92 M94 9 H137" /></g>
      <g transform="translate(582 541)" filter="url(#life-shadow)"><path d="M0 67 Q42 7 84 67 Q126 7 168 67 V118 H0Z" fill="#4e7694" /><rect x="11" y="57" width="146" height="70" rx="22" fill="#638ba6" /><path d="M21 127 L7 197 M147 127 L161 197" stroke="#35454f" stroke-width="13" /></g>
      <ellipse cx="400" cy="749" rx="180" ry="37" fill="#6e725c" opacity=".28" />
    </g>

    <!-- Public transit -->
    <g v-else-if="scene === 'transport-public'" class="scene">
      <rect width="800" height="800" fill="#9eb7c1" /><rect y="564" width="800" height="236" fill="#4a5158" />
      <rect x="0" y="100" width="800" height="447" fill="#c2c9c8" /><path d="M0 180 H800 M0 284 H800 M0 388 H800 M0 492 H800" stroke="#9aa6a8" stroke-width="8" />
      <g filter="url(#life-shadow)">
        <path d="M23 279 H777 V582 H23Z" fill="#e8ece9" stroke="#3e5a6a" stroke-width="13" /><rect x="55" y="319" width="690" height="109" rx="9" fill="#79a9bb" />
        <g fill="#bfe0e7" stroke="#4c7180" stroke-width="7"><rect x="78" y="334" width="103" height="78" /><rect x="202" y="334" width="103" height="78" /><rect x="326" y="334" width="103" height="78" /><rect x="450" y="334" width="103" height="78" /><rect x="574" y="334" width="145" height="78" /></g>
        <rect x="299" y="447" width="202" height="135" fill="#637985" /><path d="M400 447 V582" stroke="#d1e1e3" stroke-width="8" />
        <path d="M23 279 H777" stroke="#d95258" stroke-width="27" /><circle cx="134" cy="583" r="31" fill="#252d32" /><circle cx="666" cy="583" r="31" fill="#252d32" />
      </g>
      <path d="M0 642 H800" stroke="#f2db72" stroke-width="12" /><path d="M0 710 H800" stroke="#30363b" stroke-width="7" stroke-dasharray="44 28" />
      <g transform="translate(57 482)"><rect width="104" height="74" rx="8" fill="#26384d" /><text x="52" y="51" fill="#fff" font-size="39" font-weight="900" text-anchor="middle">BUS</text><path d="M52 74 V146" stroke="#26384d" stroke-width="12" /></g>
      <ellipse cx="400" cy="754" rx="185" ry="39" fill="#242a2f" opacity=".31" />
    </g>

    <!-- Used car -->
    <g v-else-if="scene === 'transport-used'" class="scene">
      <rect width="800" height="800" fill="url(#life-sky)" /><rect y="510" width="800" height="290" fill="#6b8c62" />
      <rect x="45" y="220" width="710" height="398" fill="#c7c0b3" /><path d="M18 235 L400 91 L782 235Z" fill="#505c64" stroke="#354048" stroke-width="12" /><rect x="105" y="270" width="590" height="348" fill="#59656b" /><path d="M105 344 H695 M105 418 H695 M105 492 H695" stroke="#7b878b" stroke-width="9" />
      <g transform="translate(52 461)" filter="url(#life-shadow)">
        <path d="M0 92 L66 24 H205 L269 92 V177 H0Z" fill="#557c91" /><path d="M82 24 L111 -24 H177 L205 24Z" fill="#a5cbd4" stroke="#4c6874" stroke-width="8" />
        <path d="M17 106 H70 M214 106 H253" stroke="#e2c878" stroke-width="18" /><circle cx="58" cy="177" r="36" fill="#252d31" /><circle cx="213" cy="177" r="36" fill="#252d31" />
        <path d="M32 72 Q55 48 82 67 M178 58 Q211 38 237 64" fill="none" stroke="#7f96a0" stroke-width="8" />
      </g>
      <g transform="translate(608 500)" filter="url(#life-shadow)"><circle cx="58" cy="58" r="54" fill="#242b2f" /><circle cx="58" cy="58" r="25" fill="#b8c0bf" /><rect x="0" y="129" width="135" height="75" rx="9" fill="#b87545" /><path d="M21 152 H113 M21 180 H91" stroke="#e6bd56" stroke-width="10" /></g>
      <path d="M0 653 H800 V800 H0Z" fill="#4e5559" /><path d="M0 677 H800" stroke="#d9d5c6" stroke-width="12" />
      <ellipse cx="400" cy="754" rx="185" ry="40" fill="#252c30" opacity=".32" />
    </g>

    <!-- New car showroom -->
    <g v-else-if="scene === 'transport-new'" class="scene">
      <rect width="800" height="800" fill="#e8ebe8" /><rect y="590" width="800" height="210" fill="#aab5b7" /><path d="M0 650 H800 M0 718 H800 M95 590 L72 800 M270 590 L260 800 M530 590 L540 800 M705 590 L728 800" stroke="#8a989b" stroke-width="5" />
      <rect x="18" y="52" width="764" height="401" fill="#8fc1d1" stroke="#536b75" stroke-width="15" /><path d="M209 60 V445 M400 60 V445 M591 60 V445" stroke="#536b75" stroke-width="10" />
      <g fill="#536d76" opacity=".42"><path d="M54 445 V310 H163 V445 M235 445 V266 H358 V445 M445 445 V294 H565 V445 M624 445 V238 H748 V445" /></g>
      <g transform="translate(27 430)" filter="url(#life-shadow)">
        <path d="M0 111 L75 30 H242 L317 111 V199 H0Z" fill="#d65359" /><path d="M96 30 L130 -28 H211 L242 30Z" fill="#b9dce2" stroke="#6d8c95" stroke-width="8" /><path d="M28 126 H83 M236 126 H288" stroke="#f2dc91" stroke-width="19" /><circle cx="68" cy="199" r="39" fill="#232a2e" /><circle cx="252" cy="199" r="39" fill="#232a2e" /><rect x="129" y="132" width="62" height="21" rx="9" fill="#e8d3a0" />
      </g>
      <g transform="translate(581 411)" filter="url(#life-shadow)"><path d="M0 78 Q61 -7 122 78 Q183 -7 244 78 V122 H0Z" fill="#5b7d91" /><rect x="14" y="67" width="215" height="96" rx="25" fill="#6d92a5" /><circle cx="53" cy="163" r="30" fill="#273035" /><circle cx="192" cy="163" r="30" fill="#273035" /></g>
      <g transform="translate(96 260)"><path d="M70 0 L91 47 L140 52 L103 85 L114 134 L70 109 L26 134 L37 85 L0 52 L49 47Z" fill="#e4b94e" /></g>
      <g transform="translate(235 397)" filter="url(#life-shadow)"><path d="M0 0 Q54 -74 108 0 Q54 26 0 0Z" fill="#e9c251" /><path d="M54 -18 V84" stroke="#e9c251" stroke-width="18" /><path d="M0 0 L108 84 M108 0 L0 84" stroke="#e9c251" stroke-width="15" /></g>
      <ellipse cx="400" cy="755" rx="187" ry="40" fill="#576267" opacity=".28" />
    </g>

    <!-- Luxury car / city valet -->
    <g v-else class="scene">
      <rect width="800" height="800" fill="url(#life-night)" /><circle cx="665" cy="103" r="55" fill="#f3d58b" opacity=".8" />
      <path d="M0 204 H105 V565 H0Z M97 131 H228 V565 H97Z M220 248 H335 V565 H220Z M465 186 H579 V565 H465Z M570 112 H708 V565 H570Z M699 226 H800 V565 H699Z" fill="#17223b" />
      <g fill="#f0cc78"><path d="M123 171 H150 V199 H123Z M177 171 H204 V199 H177Z M123 226 H150 V254 H123Z M596 153 H625 V183 H596Z M653 153 H682 V183 H653Z M596 214 H625 V244 H596Z" /></g>
      <rect y="560" width="800" height="240" fill="#252c35" /><path d="M0 587 H800" stroke="#999da3" stroke-width="13" /><path d="M0 714 H800" stroke="#e5c763" stroke-width="8" stroke-dasharray="50 35" />
      <g transform="translate(20 453)" filter="url(#life-shadow)">
        <path d="M0 115 L88 30 H253 L337 115 V207 H0Z" fill="#20242b" stroke="#d1ac58" stroke-width="8" /><path d="M112 30 L151 -31 H222 L253 30Z" fill="#6e8791" stroke="#d1ac58" stroke-width="7" /><path d="M31 133 H95 M245 133 H306" stroke="#f5df9a" stroke-width="20" /><circle cx="74" cy="207" r="42" fill="#101418" stroke="#c5a553" stroke-width="8" /><circle cx="267" cy="207" r="42" fill="#101418" stroke="#c5a553" stroke-width="8" /><path d="M130 139 H207" stroke="#d1ac58" stroke-width="9" />
      </g>
      <g transform="translate(612 441)" filter="url(#life-shadow)"><path d="M0 0 H151 V212 H0Z" fill="#7c2636" /><path d="M0 0 L76 -76 L151 0" fill="#b4914d" /><path d="M28 0 V212 M123 0 V212" stroke="#d1ad61" stroke-width="11" /><path d="M-27 212 H178" stroke="#d1ad61" stroke-width="15" /></g>
      <g transform="translate(579 294)"><circle cx="47" cy="47" r="47" fill="#f2e6ce" /><path d="M47 20 V74 M20 47 H74" stroke="#d3af5e" stroke-width="9" /></g>
      <ellipse cx="400" cy="756" rx="192" ry="41" fill="#0d1118" opacity=".45" />
    </g>
  </svg>
</template>

<style scoped>
.lifestyle-backdrop { display: block; width: 100%; height: 100%; }
.scene { transform-origin: center; animation: lifestyle-in .35s ease both; }
@keyframes lifestyle-in { from { opacity: 0; } to { opacity: 1; } }
</style>
