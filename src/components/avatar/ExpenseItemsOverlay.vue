<script setup lang="ts">
defineProps<{ theme: string }>()
</script>

<template>
  <svg class="expense-overlay" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <filter id="expense-shadow" x="-35%" y="-35%" width="170%" height="170%"><feDropShadow dx="0" dy="9" stdDeviation="9" flood-color="#111827" flood-opacity=".32" /></filter>
    </defs>

    <!-- Food items live naturally in the chosen home. -->
    <g v-if="theme.startsWith('food_')" class="items" filter="url(#expense-shadow)">
      <g v-if="theme === 'food_budget'">
        <g transform="translate(36 507)"><path d="M0 58 Q20 0 74 0 Q128 0 148 58 V190 H0Z" fill="#b58b56" /><path d="M20 58 H128" stroke="#71563a" stroke-width="9" /><text x="74" y="128" fill="#efe0b8" font-size="29" font-weight="900" text-anchor="middle">RICE</text></g>
        <g transform="translate(622 536)"><rect width="72" height="125" rx="9" fill="#c85a51" /><rect x="8" y="19" width="56" height="66" rx="28" fill="#f1d28a" /><rect x="82" width="72" height="125" rx="9" fill="#6b9472" /><rect x="90" y="19" width="56" height="66" rx="28" fill="#f0d7a1" /></g>
      </g>
      <g v-else-if="theme === 'food_home'">
        <g transform="translate(29 484)"><path d="M0 53 H184 V206 H0Z" fill="#b98754" /><path d="M34 53 Q35 0 92 0 Q149 0 150 53" fill="none" stroke="#745038" stroke-width="12" /><path d="M35 92 Q55 49 79 92 Q102 37 128 92 Q153 57 174 95" fill="#5c985f" /><circle cx="54" cy="111" r="24" fill="#d6554f" /><circle cx="128" cy="117" r="28" fill="#e2b248" /></g>
        <g transform="translate(603 522)"><path d="M0 47 H172 V137 Q86 185 0 137Z" fill="#687981" /><path d="M26 47 Q27 0 86 0 Q145 0 146 47" fill="none" stroke="#404b50" stroke-width="13" /><path d="M43 90 H129" stroke="#d8e0dc" stroke-width="11" /><path d="M139 -23 V58 M158 -23 V58" stroke="#c8d0ce" stroke-width="9" /></g>
      </g>
      <g v-else-if="theme === 'food_mixed'">
        <g transform="translate(34 539)"><path d="M0 35 H174 V129 Q87 174 0 129Z" fill="#73858c" /><path d="M31 35 Q31 0 87 0 Q143 0 143 35" fill="none" stroke="#46545a" stroke-width="12" /></g>
        <g transform="translate(613 543)"><path d="M0 48 L74 0 L148 48 V149 H0Z" fill="#d8c39c" stroke="#9a754d" stroke-width="8" /><path d="M74 0 V149 M0 48 H148" stroke="#9a754d" stroke-width="7" /><path d="M21 78 H58 M91 78 H127" stroke="#c95b51" stroke-width="10" /></g>
      </g>
      <g v-else-if="theme === 'food_delivery'">
        <g transform="translate(24 478)"><rect x="0" y="84" width="197" height="126" rx="12" fill="#d78345" /><path d="M18 84 L49 13 H148 L179 84" fill="#efb056" /><path d="M68 13 Q70 -18 99 -18 Q129 -18 130 13" fill="none" stroke="#8a5e36" stroke-width="11" /><path d="M39 127 H158 M39 164 H127" stroke="#f1d29a" stroke-width="9" /></g>
        <g transform="translate(633 469)"><rect width="133" height="213" rx="19" fill="#293743" stroke="#70828a" stroke-width="9" /><circle cx="66" cy="51" r="29" fill="#dc6458" /><path d="M39 107 H94 M39 137 H109 M39 167 H83" stroke="#e3d7bd" stroke-width="10" /><path d="M52 51 L62 62 L82 37" fill="none" stroke="#fff" stroke-width="8" /></g>
      </g>
      <g v-else>
        <g transform="translate(19 522)"><rect y="58" width="220" height="33" rx="14" fill="#5d4639" /><path d="M25 91 V194 M195 91 V194" stroke="#43332c" stroke-width="13" /><circle cx="110" cy="43" r="43" fill="#eee7d8" stroke="#c1b7a6" stroke-width="8" /><circle cx="110" cy="43" r="19" fill="#c96d52" /><path d="M73 43 H147" stroke="#7e9c67" stroke-width="9" /></g>
        <g transform="translate(627 485)"><path d="M71 0 V86" stroke="#dcc779" stroke-width="9" /><path d="M71 0 Q1 31 12 89 H130 Q141 31 71 0Z" fill="#f2dc8f" /><rect x="0" y="119" width="142" height="43" rx="9" fill="#78543e" /><path d="M24 119 V63 M118 119 V63" stroke="#d4bea0" stroke-width="7" /><circle cx="24" cy="49" r="16" fill="#d5ba87" /><circle cx="118" cy="49" r="16" fill="#d5ba87" /></g>
      </g>
    </g>

    <!-- Insurance paperwork and protection symbols. -->
    <g v-else-if="theme.startsWith('insurance_')" class="items" filter="url(#expense-shadow)">
      <g transform="translate(28 455)"><rect width="193" height="231" rx="12" fill="#f1eadb" stroke="#526575" stroke-width="10" /><rect x="51" y="-24" width="91" height="45" rx="9" fill="#718696" /><path d="M33 65 H158 M33 101 H139 M33 137 H158 M33 173 H121" stroke="#82939a" stroke-width="9" /><path v-if="theme !== 'insurance_none'" d="M143 169 L157 183 L184 148" fill="none" stroke="#55a779" stroke-width="10" /></g>
      <g v-if="theme === 'insurance_none'" transform="translate(602 472)"><path d="M79 0 L158 149 H0Z" fill="#e0ad4f" stroke="#704f31" stroke-width="10" /><text x="79" y="118" fill="#68472d" font-size="82" font-weight="900" text-anchor="middle">!</text></g>
      <g v-else transform="translate(582 414)">
        <path d="M100 0 Q142 34 193 38 V122 Q184 208 100 251 Q16 208 7 122 V38 Q58 34 100 0Z" :fill="theme === 'insurance_basic' ? '#718ca0' : theme === 'insurance_standard' ? '#4e8f77' : '#b59045'" stroke="#f0e7d4" stroke-width="10" />
        <path d="M100 53 V178 M38 116 H162" stroke="#f4efe2" stroke-width="22" stroke-linecap="round" />
        <g v-if="theme === 'insurance_premium' || theme === 'insurance_max'" fill="#e7c768"><circle cx="17" cy="215" r="25" /><circle cx="183" cy="215" r="25" /></g>
        <g v-if="theme === 'insurance_max'" transform="translate(45 250)"><rect width="110" height="54" rx="10" fill="#3e5969" /><path d="M19 18 H91 M19 38 H73" stroke="#e9e2d2" stroke-width="7" /></g>
      </g>
    </g>

    <!-- Leisure equipment selected for Fun. -->
    <g v-else-if="theme.startsWith('fun_')" class="items" filter="url(#expense-shadow)">
      <g v-if="theme === 'fun_free'">
        <g transform="translate(35 506)"><rect y="74" width="201" height="38" rx="12" fill="#6d4f3c" /><path d="M28 112 V188 M173 112 V188" stroke="#4d392f" stroke-width="13" /><path d="M18 74 Q100 0 183 74" fill="#7aaa69" /><circle cx="61" cy="55" r="30" fill="#d7b44e" /></g>
        <g transform="translate(622 520)"><path d="M0 0 H139 V168 H0Z" fill="#f1e7ce" stroke="#6a5445" stroke-width="9" /><path d="M70 0 V168 M22 40 H52 M88 40 H118 M22 79 H52 M88 79 H118" stroke="#b25e56" stroke-width="8" /></g>
      </g>
      <g v-else-if="theme === 'fun_budget'">
        <g transform="translate(31 479)"><rect width="199" height="130" rx="10" fill="#263746" /><path d="M70 34 L142 65 L70 100Z" fill="#74a8b8" /><rect x="22" y="153" width="157" height="38" rx="12" fill="#6d4f3d" /></g>
        <g transform="translate(620 510)"><path d="M0 44 Q34 0 68 44 Q102 0 136 44 V139 H0Z" fill="#e8d5a2" /><g fill="#f3eee1"><circle cx="30" cy="57" r="13" /><circle cx="68" cy="77" r="13" /><circle cx="106" cy="52" r="13" /><circle cx="43" cy="110" r="13" /><circle cx="95" cy="114" r="13" /></g></g>
      </g>
      <g v-else-if="theme === 'fun_moderate'">
        <g transform="translate(22 502)"><rect width="216" height="153" rx="12" fill="#d5c090" /><path d="M0 51 H216 M72 0 V153 M144 0 V153" stroke="#75604a" stroke-width="8" /><circle cx="36" cy="26" r="14" fill="#c75050" /><circle cx="180" cy="127" r="14" fill="#527da1" /></g>
        <g transform="translate(629 464)"><path d="M62 0 V193" stroke="#6b4935" stroke-width="18" /><ellipse cx="62" cy="148" rx="61" ry="78" fill="#c78343" /><circle cx="62" cy="139" r="20" fill="#4e352b" /><path d="M62 0 L90 29" stroke="#6b4935" stroke-width="17" /></g>
      </g>
      <g v-else-if="theme === 'fun_active'">
        <g transform="translate(22 528)" stroke="#303b42" stroke-width="17"><path d="M0 70 H219" /><path d="M25 25 V115 M54 42 V98 M165 42 V98 M194 25 V115" /></g>
        <g transform="translate(601 487)" fill="none" stroke="#3f5361" stroke-width="11"><circle cx="43" cy="116" r="42" /><circle cx="172" cy="116" r="42" /><path d="M43 116 L92 34 L132 116 H43 L109 116 L172 116 L130 30 H91 M92 34 H130" /></g>
      </g>
      <g v-else>
        <g transform="translate(30 472)"><rect y="59" width="194" height="151" rx="14" fill="#86556e" /><path d="M49 59 Q50 0 97 0 Q144 0 145 59" fill="none" stroke="#d4b15d" stroke-width="12" /><path d="M97 59 V210" stroke="#d4b15d" stroke-width="8" /></g>
        <g transform="translate(577 441)"><path d="M0 103 Q100 -35 200 103 L168 115 L137 160 L104 123 L65 162 L36 116Z" fill="#f0ece0" stroke="#536878" stroke-width="9" /><path d="M99 107 L77 187 L122 139" fill="#f0ece0" stroke="#536878" stroke-width="8" /><path d="M16 218 H184" stroke="#d4af57" stroke-width="14" /><text x="100" y="251" fill="#e8c765" font-size="38" font-weight="900" text-anchor="middle">VIP</text></g>
      </g>
    </g>

    <!-- Other essentials and extras. -->
    <g v-else-if="theme.startsWith('other_')" class="items" filter="url(#expense-shadow)">
      <g v-if="theme === 'other_minimal'">
        <g transform="translate(29 504)"><path d="M0 63 L96 0 L192 63 V186 H0Z" fill="#b47a4a" /><path d="M96 0 V186 M0 63 H192" stroke="#795234" stroke-width="9" /><path d="M28 92 H74 M119 92 H164" stroke="#e1c799" stroke-width="9" /></g>
        <g transform="translate(635 535)"><rect width="125" height="157" rx="8" fill="#ded5c1" /><path d="M22 35 H103 M22 69 H83 M22 103 H99" stroke="#9b8d76" stroke-width="9" /></g>
      </g>
      <g v-else-if="theme === 'other_basic'">
        <g transform="translate(43 470)"><rect width="137" height="218" rx="20" fill="#2d3b46" stroke="#74838a" stroke-width="10" /><circle cx="69" cy="172" r="14" fill="#88979b" /><path d="M25 36 H112 M25 68 H89" stroke="#78a9b7" stroke-width="9" /></g>
        <g transform="translate(614 533)"><rect y="43" width="159" height="93" rx="12" fill="#435766" /><circle cx="41" cy="88" r="11" fill="#75d0a8" /><circle cx="72" cy="88" r="11" fill="#e2be5a" /><path d="M79 43 Q80 0 126 0" fill="none" stroke="#435766" stroke-width="10" /><path d="M100 31 Q124 6 148 31 M110 48 Q124 33 138 48" fill="none" stroke="#79bdd0" stroke-width="7" /></g>
      </g>
      <g v-else-if="theme === 'other_comfortable'">
        <g transform="translate(23 473)"><rect y="84" width="211" height="143" rx="32" fill="#6e8492" /><rect x="24" y="49" width="163" height="126" rx="34" fill="#829aa7" /><rect x="56" y="74" width="100" height="79" rx="20" fill="#d2ae79" /></g>
        <g transform="translate(626 439)"><path d="M69 0 Q8 44 0 107 H138 Q130 44 69 0Z" fill="#e7d18f" /><path d="M69 107 V221 M23 221 H115" stroke="#685547" stroke-width="11" /></g>
      </g>
      <g v-else-if="theme === 'other_generous'">
        <g transform="translate(26 497)"><rect y="52" width="207" height="157" rx="12" fill="#d15d5d" /><path d="M103 52 V209 M0 105 H207" stroke="#edcf77" stroke-width="16" /><path d="M103 52 Q28 25 52 0 Q81 -22 103 52 Q125 -22 154 0 Q178 25 103 52Z" fill="#edcf77" /></g>
        <g transform="translate(599 454)"><path d="M98 0 Q138 34 187 38 V120 Q179 202 98 244 Q17 202 9 120 V38 Q58 34 98 0Z" fill="#5e9b79" stroke="#ecdfc2" stroke-width="10" /><path d="M49 118 Q76 84 98 119 Q120 84 147 118 Q151 159 98 187 Q45 159 49 118Z" fill="#f1d48b" /></g>
      </g>
      <g v-else>
        <g transform="translate(24 472)"><path d="M0 65 H207 V219 H0Z" fill="#8c5870" /><path d="M35 65 Q36 0 103 0 Q171 0 172 65" fill="none" stroke="#d4ae55" stroke-width="14" /><path d="M104 65 V219" stroke="#d4ae55" stroke-width="9" /><circle cx="51" cy="117" r="18" fill="#d4ae55" /></g>
        <g transform="translate(596 430)"><circle cx="93" cy="93" r="86" fill="#d8b653" stroke="#f1e0a7" stroke-width="10" /><circle cx="93" cy="93" r="56" fill="#eef0e8" /><path d="M93 93 L93 42 M93 93 L133 117" stroke="#3f4b51" stroke-width="10" stroke-linecap="round" /><rect x="13" y="197" width="160" height="47" rx="11" fill="#4c5962" /><text x="93" y="231" fill="#e6c45e" font-size="27" font-weight="900" text-anchor="middle">DESIGNER</text></g>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.expense-overlay { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
.items { transform-origin: center; animation: items-in .3s ease both; }
@keyframes items-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
</style>
