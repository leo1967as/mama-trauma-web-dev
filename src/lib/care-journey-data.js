const phase = (range, title, feel, body, watchOut, tips, sources, epdsPrompt = null) => ({
  range, title, feel, body, watchOut, tips, sources, epdsPrompt,
});

const EPDS_PROMPT = "ถึงเวลาทำแบบประเมินสุขภาพจิตแล้วค่ะ แบบประเมิน EPDS เป็นเครื่องมือที่ช่วยประเมินอารมณ์และความรู้สึกของคุณแม่หลังคลอด ใช้เวลาเพียงไม่กี่นาทีในการทำ ไม่มีคำตอบที่ถูกหรือผิด เพียงตอบตามความรู้สึกจริงของคุณแม่ในช่วง 7 วันที่ผ่านมา เพื่อให้ทีมพยาบาลสามารถประเมินและให้คำแนะนำที่เหมาะสมค่ะ";

export const CARE_JOURNEY_TH = [
  phase(
    "Day 1–3", "ช่วงแรกของการเป็นคุณแม่",
    "ช่วง 3 วันแรกนี้ คุณแม่อาจรู้สึกดีใจและตื่นเต้นกับการได้พบลูกน้อย แต่ในเวลาเดียวกันก็อาจรู้สึกเหนื่อยล้าจนแทบหมดแรง หรือมีความกังวลแวบขึ้นมาว่าจะดูแลลูกได้ดีพอไหม ความรู้สึกที่สลับกันแบบนี้เป็นเรื่องที่เกิดขึ้นกับคุณแม่เกือบทุกคนค่ะ ไม่ได้แปลว่ามีอะไรผิดปกติแต่อย่างใด",
    "ร่างกายของคุณแม่กำลังปรับตัวครั้งใหญ่ค่ะ ฮอร์โมนที่เคยสูงตลอดช่วงตั้งครรภ์ลดลงอย่างรวดเร็วหลังคลอด ซึ่งส่งผลต่ออารมณ์ได้โดยตรง ความเหนื่อยล้าและความไม่สบายตัวจากการคลอดก็เป็นส่วนหนึ่งที่ทำให้จิตใจรู้สึกหนักขึ้นได้เช่นกันค่ะ",
    "หากความรู้สึกเศร้า วิตกกังวล หรือหมดกำลังใจต่อเนื่องนานกว่า 2 สัปดาห์ หรือเริ่มส่งผลกระทบต่อการใช้ชีวิตประจำวัน ลองกดปุ่ม 💗 มุมจอเพื่อดูช่องทางขอความช่วยเหลือที่เหมาะกับคุณได้เสมอนะคะ\n• รู้สึกสับสน หรือมีความคิดวนเวียนผิดปกติ\n• ได้ยินเสียงหรือเห็นภาพที่คนอื่นไม่ได้ยิน/เห็น\n• กระสับกระส่ายรุนแรงจนหยุดไม่ได้\n• ง่วงมากแต่นอนไม่หลับเลย แม้ลูกจะหลับแล้ว",
    "• นอนพักให้ได้มากที่สุดเท่าที่ทำได้ แม้จะเป็นช่วงสั้นๆ ก็มีความหมายค่ะ\n• ไม่ต้องแบกทุกอย่างไว้คนเดียว ให้คนรอบข้างเข้ามาช่วยได้เลย\n• ถ้าอยากร้องไห้ก็ร้องได้นะคะ ไม่เป็นไรเลยค่ะ\n• หากมีเวลาว่าง ลองหาเวลาดูแลตัวเองด้วยการออกกำลังกายเบา ๆ เล่นโยคะ หรือยืดเหยียด เพื่อช่วยให้ร่างกายและจิตใจผ่อนคลายมากขึ้นนะคะ",
    "APA DSM-5 (2013) • NHS Postpartum Guide (2022) • Bergink, V. et al. (2016) The American Journal of Psychiatry • ACOG Committee Opinion No. 736 (2018) • PSI Clinical Criteria (2021)",
  ),
  phase(
    "Day 4–7", "ช่วงที่อารมณ์อาจแปรปรวนมากที่สุด",
    "ช่วงนี้คุณแม่หลายคนรู้สึกว่าอารมณ์ขึ้นลงมากกว่าที่เคยเป็นค่ะ อาจร้องไห้โดยไม่รู้ตัวว่าเกิดจากอะไร หงุดหงิดง่าย หรือวิตกกังวลกับเรื่องเล็กน้อย ความรู้สึกแบบนี้มีชื่อเรียกว่า Baby Blues ซึ่งพบได้ในคุณแม่มากถึง 80% ค่ะ และมักจะค่อยๆ ดีขึ้นเองภายใน 1–2 สัปดาห์แรกหลังคลอด",
    "ช่วงหลังคลอดเป็นช่วงที่ร่างกายกำลังปรับตัวครั้งใหญ่ค่ะ ระดับฮอร์โมนลดลงอย่างรวดเร็ว ประกอบกับการนอนหลับที่ไม่เพียงพอจากการดูแลลูก และความไม่สบายตัว เช่น อาการคัดตึงเต้านมหรือปวดแผลคลอด จึงเป็นเรื่องปกติที่คุณแม่อาจรู้สึกเหนื่อยล้า อารมณ์อ่อนไหว หรือรู้สึกไวต่อความเครียดมากกว่าปกติ",
    "Baby Blues ปกติจะค่อยๆ ดีขึ้นเองค่ะ แต่หากคุณแม่สังเกตเห็นสิ่งเหล่านี้ ลองกดปุ่ม 💗 มุมจอเพื่อดูช่องทางขอความช่วยเหลือที่เหมาะกับคุณได้เสมอนะคะ\n• รู้สึกไม่อยากอยู่ใกล้หรือสัมผัสลูกเลย\n• รู้สึกเครียดหรือวิตกกังวลมากจนดูแลลูกในตอนนั้นไม่ไหว",
    "• อนุญาตให้ตัวเองได้รู้สึกในสิ่งที่กำลังรู้สึกอยู่นะคะ คุณไม่จำเป็นต้องเข้มแข็งตลอดเวลา\n• หากสะดวก ลองบอกคนใกล้ตัวว่าตอนนี้คุณต้องการอะไร ไม่ว่าจะเป็นพื้นที่เงียบ ๆ หรือเพียงแค่ใครสักคนนั่งอยู่ข้าง ๆ\n• หากพอไหว ลองจิบน้ำ ทานอาหารรองท้อง ยืดเหยียดร่างกาย และพักผ่อนเมื่อมีโอกาสนะคะ เพราะเมื่อร่างกายได้รับการดูแล ใจก็จะค่อย ๆ ฟื้นตัวไปด้วยค่ะ",
    "CDC Depressive Symptoms Report (2020) • WHO Maternal Health (2019) • ACOG Clinical Practice Guideline No. 4 (2023) • NICE Guideline NG201 (2021) • Mindell, J.A. et al. (2015) Sleep Medicine",
  ),
  phase(
    "Week 2–3", "เมื่อคนรอบข้างเริ่มกลับสู่ชีวิตปกติ",
    "เมื่อคนที่เคยมาช่วยเริ่มกลับไปทำงานหรือกลับบ้าน คุณแม่อาจรู้สึกโดดเดี่ยว เหนื่อยล้า หรือไม่มั่นใจในการดูแลลูกมากขึ้น การทำสิ่งเดิม ๆ ซ้ำทุกวันและการพักผ่อนไม่เพียงพออาจทำให้รู้สึกท้อได้ ความรู้สึกเหล่านี้เกิดขึ้นได้กับคุณแม่หลายคน และไม่ได้หมายความว่าคุณดูแลลูกได้ไม่ดีค่ะ",
    "ช่วงนี้คุณแม่อาจรู้สึกเหนื่อยล้าจากการนอนหลับไม่เพียงพอ และทำให้อารมณ์อ่อนไหวได้เป็นเรื่องปกติ อย่างไรก็ตาม คุณแม่บางรายอาจมีการเปลี่ยนแปลงของการทำงานของต่อมไทรอยด์หลังคลอด ซึ่งอาจเป็นสาเหตุของความเหนื่อยผิดปกติหรืออารมณ์แปรปรวน หากอาการไม่ดีขึ้นหรือเริ่มส่งผลต่อการใช้ชีวิตประจำวัน แนะนำให้ปรึกษาแพทย์เพื่อรับการประเมินค่ะ",
    "หากอาการเหล่านี้ยังคงอยู่นานเกิน 2 สัปดาห์หลังคลอด ลองกดปุ่ม 💗 มุมจอเพื่อดูช่องทางขอความช่วยเหลือที่เหมาะกับคุณได้เสมอนะคะ\n• ร้องไห้หรืออารมณ์ดิ่งยังคงอยู่และไม่ดีขึ้นเลย\n• รู้สึกไม่มีความสุขกับอะไรเลย แม้แต่สิ่งที่เคยชอบ\n• มีความคิดอยากทำร้ายตัวเองหรือลูก — กดปุ่ม 💗 มุมจอตอนนี้เลยนะคะ เพื่อเลือกวิธีขอความช่วยเหลือที่เหมาะกับคุณ",
    "• หากพร้อม ลองเล่าความรู้สึกให้คนที่ไว้ใจฟังนะคะ\n• ถ้าพอไหว ลองออกไปรับแสงแดดอ่อน ๆ สักเล็กน้อย\n• จำไว้ว่าการขอความช่วยเหลือไม่ได้แปลว่าคุณแม่อ่อนแอนะคะ",
    "Negron, R. et al. (2013) Journal of Obstetric, Gynecologic, & Neonatal Nursing • Stagnaro-Green, A. et al. (2011) American Thyroid Association Guidelines • APA DSM-5 Criteria for MDD with Peripartum Onset (2013) • WHO Recommendations on Maternal and Newborn Care (2022) • ACOG Committee Opinion No. 757 (2018, Reaffirmed 2023)", EPDS_PROMPT,
  ),
  phase(
    "Week 4–6", "ช่วงปรับตัวครั้งใหญ่",
    "ช่วงนี้คุณแม่หลายคนอาจรู้สึกว่าชีวิตเปลี่ยนไปจากเดิมมาก อาจรู้สึกเหนื่อย โดดเดี่ยว หรือมีความรู้สึกขัดแย้งระหว่างความรักที่มีต่อลูกกับความต้องการเวลาพักของตัวเอง บางครั้งอาจหงุดหงิดหรือไม่พอใจสิ่งรอบตัวมากกว่าปกติ ความรู้สึกเหล่านี้เกิดขึ้นได้ในช่วงของการปรับตัวสู่บทบาทการเป็นคุณแม่ และไม่ได้หมายความว่าคุณเป็นคุณแม่ที่ไม่ดีค่ะ",
    "ระดับฮอร์โมนเริ่มกลับเข้าสู่ภาวะสมดุลมากขึ้น แต่ร่างกายยังคงฟื้นตัวหลังคลอด คุณแม่หลายคนอาจมีอาการผมร่วงมากกว่าปกติจากการเปลี่ยนแปลงของฮอร์โมน ซึ่งเป็นเรื่องที่พบได้บ่อยและมักดีขึ้นได้เองเมื่อเวลาผ่านไป จึงไม่ต้องกังวลมากนะคะ",
    "ช่วงนี้เป็นช่วงที่สำคัญมากในการดูแลสุขภาพจิตค่ะ หากคุณแม่สังเกตเห็นสัญญาณเหล่านี้ ลองกดปุ่ม 💗 มุมจอเพื่อดูช่องทางขอความช่วยเหลือที่เหมาะกับคุณได้เสมอนะคะ\n• มีความคิดที่ไม่ต้องการผุดขึ้นมาในหัวเกี่ยวกับการทำร้ายลูกโดยไม่ตั้งใจ\n• แยกตัวจากคนรอบข้างและไม่อยากพบใครเลย\n• นอนไม่หลับเลยแม้ร่างกายจะเหนื่อยมากแค่ไหนก็ตาม",
    "• ถ้ามีนัดตรวจหลังคลอดช่วง 6 สัปดาห์ อย่าลืมบอกแพทย์หรือพยาบาลว่าตอนนี้รู้สึกยังไงบ้างนะคะ\n• หากพอไหว ลองหาเวลาสั้น ๆ ให้ตัวเองได้พักหรือทำสิ่งที่ชอบนะคะ\n• ความรู้สึกที่หลากหลายหรือสับสนในช่วงนี้เป็นเรื่องที่เกิดขึ้นได้ค่ะ",
    "Mercer, R.T. (2004) Journal of Nursing Scholarship • CDC Morbidity and Mortality Weekly Report (2020) • Fairbrother, N. et al. (2008) Archives of Women's Mental Health • ACOG & AAP Joint Statement (2019) • NICE Clinical Guideline NG201 (2021)", EPDS_PROMPT,
  ),
  phase(
    "Month 2–3", "ช่วงเปลี่ยนผ่านสู่ชีวิตใหม่",
    "ช่วงนี้คุณแม่หลายคนอาจรู้สึกเหนื่อยล้าสะสมจากการดูแลลูกอย่างต่อเนื่อง บางครั้งอาจรู้สึกหมดแรง หรือกังวลเกี่ยวกับการกลับไปทำงานและการจัดสมดุลระหว่างการดูแลลูกกับชีวิตประจำวัน ความรู้สึกเหล่านี้เป็นเรื่องที่เกิดขึ้นได้ เพราะการปรับตัวสู่บทบาทการเป็นคุณแม่ต้องอาศัยเวลา และคุณแม่ไม่จำเป็นต้องรับมือกับทุกอย่างเพียงลำพังนะคะ",
    "คุณแม่บางรายอาจมีการเปลี่ยนแปลงของการทำงานของต่อมไทรอยด์หลังคลอด ทำให้รู้สึกอ่อนเพลียหรืออารมณ์แปรปรวนได้ หากมีอาการผิดปกติต่อเนื่อง ควรปรึกษาแพทย์ นอกจากนี้ ผมร่วงหลังคลอดเป็นอาการที่พบได้บ่อย จากการเปลี่ยนแปลงของฮอร์โมน แม้อาจทำให้รู้สึกไม่มั่นใจ แต่โดยทั่วไปจะค่อย ๆ ดีขึ้นได้เองค่ะ",
    "หากความรู้สึกเศร้า วิตกกังวล หรือหมดกำลังใจต่อเนื่องนานกว่า 2 สัปดาห์ หรือเริ่มส่งผลกระทบต่อการใช้ชีวิตประจำวัน ลองกดปุ่ม 💗 มุมจอเพื่อดูช่องทางขอความช่วยเหลือที่เหมาะกับคุณได้เสมอนะคะ\n• รู้สึกโกรธหรือหัวร้อนง่ายผิดปกติจนตัวเองก็แปลกใจ\n• มีพฤติกรรมที่ทำซ้ำๆ โดยไม่สามารถหยุดได้ เช่น ตรวจสอบการหายใจของลูกตลอดคืน\n• รู้สึกซึมเศร้าลึกๆ ที่ซ่อนอยู่ใต้ความโกรธหรือความเหนื่อย\n• รู้สึกผิดหรือโทษตัวเองบ่อย คิดว่าตัวเองเป็นคุณแม่ที่ไม่ดีหรือทำได้ไม่ดีพอ\n• กังวลมากจนผ่อนคลายได้ยาก แม้จะมีคนช่วยดูแลลูกแล้วก็ตาม",
    "• หากรู้สึกโกรธหรือท่วมท้นมาก ลองวางลูกไว้ในที่ปลอดภัยและให้เวลากับตัวเองสักครู่นะคะ\n• ลองพูดคุยกับคนที่ไว้ใจเกี่ยวกับสิ่งที่กำลังกังวลอยู่ค่ะ\n• ความรู้สึกที่เกิดขึ้นในช่วงนี้ไม่ได้บอกว่าคุณแม่รักลูกน้อยลงนะคะ",
    "Mikolajczak, M. et al. (2018) Frontiers in Psychology • Muller, A.F. et al. (2001) Endocrine Reviews / Updated by ATA (2017) • Abramowitz, J.S. et al. (2006) Journal of Clinical Psychiatry • WHO Global Strategy on Occupational Health (2021)",
  ),
  phase(
    "Month 4–5", "ช่วงที่ลูกเปลี่ยนแปลงอีกครั้ง",
    "เมื่อถึงช่วงเดือนที่ 4–5 ลูกน้อยหลายคนอาจเริ่มมีการเปลี่ยนแปลงของการนอนหรือกิจวัตรประจำวัน ทำให้คุณแม่ต้องตื่นมาดูแลบ่อยขึ้น และอาจรู้สึกเหนื่อยล้าจากการอดนอนอีกครั้ง บางวันอาจรู้สึกท้อ หมดกำลังใจ หรือสงสัยว่าตัวเองทำได้ดีพอหรือไม่ ขอให้คุณแม่รู้ไว้นะคะว่า สิ่งเหล่านี้เป็นความรู้สึกที่พบได้ในช่วงของการปรับตัว และการเปลี่ยนแปลงของลูกเป็นส่วนหนึ่งของพัฒนาการตามธรรมชาติ ไม่ใช่ความผิดของคุณแม่ค่ะ",
    "การอดนอนและความเหนื่อยล้าที่สะสมอาจทำให้หลายสิ่งดูยากหรือหนักกว่าที่เคยค่ะ เมื่อร่างกายพักผ่อนไม่เพียงพอ การจัดการอารมณ์และความเครียดก็อาจทำได้ยากขึ้น จึงเป็นเรื่องปกติที่คุณแม่จะรู้สึกอ่อนไหว เหนื่อย หรือหมดแรงในบางวัน สิ่งเหล่านี้เป็นปฏิกิริยาตามธรรมชาติของร่างกาย ไม่ได้หมายความว่าคุณแม่ไม่เข้มแข็งหรือดูแลลูกได้ไม่ดีค่ะ",
    "หากความรู้สึกหรืออาการต่อไปนี้เป็นต่อเนื่องหลายวัน รุนแรงขึ้น หรือรบกวนการใช้ชีวิตประจำวันและการดูแลลูก ควรปรึกษาแพทย์ พยาบาล หรือบุคลากรสุขภาพนะคะ หากต้องการคำปรึกษาเร่งด่วน ลองกดปุ่ม 💗 มุมจอเพื่อดูช่องทางขอความช่วยเหลือที่เหมาะกับคุณได้เสมอนะคะ\n• รู้สึกเศร้า ว่างเปล่า หรือหมดหวังอยู่เกือบตลอดเวลา\n• รู้สึกเฉยชา ไม่ค่อยมีความสุข หรือไม่สามารถเพลิดเพลินกับการดูแลลูกหรือสิ่งที่เคยชอบได้\n• รู้สึกโกรธ หงุดหงิด หรือควบคุมอารมณ์ได้ยากบ่อยครั้ง จนกระทบต่อการดูแลลูกหรือความสัมพันธ์กับคนรอบข้าง\n• ความขัดแย้งกับคู่สมรสหรือคนในครอบครัวเพิ่มขึ้นอย่างต่อเนื่อง จนรู้สึกจัดการได้ยาก\n• มีความคิดทำร้ายตนเอง ทำร้ายลูก หรือรู้สึกว่าชีวิตไม่มีคุณค่า — กดปุ่ม 💗 มุมจอตอนนี้เลยนะคะ เพื่อเลือกวิธีขอความช่วยเหลือที่เหมาะกับคุณ",
    "• ขอให้คนช่วยดูลูกเพื่อให้คุณแม่ได้นอนต่อเนื่องอย่างน้อย 4–5 ชั่วโมงค่ะ\n• ช่วงเวลาที่ยากลำบากนี้จะค่อย ๆ ผ่านไปทีละวันค่ะ\n• ถ้ารู้สึกหมดแรงมาก บอกคนที่บ้านได้เลยนะคะ คุณแม่ไม่จำเป็นต้องรับมือคนเดียวค่ะ\n• ลองแบ่งเวลาสัก 10–15 นาทีต่อวัน เพื่อทำสิ่งที่ช่วยให้รู้สึกผ่อนคลาย เช่น ฟังเพลง ยืดเหยียดร่างกาย เดินเล่น หรือฝึกหายใจช้า ๆ นะคะ",
    "Infant Behavior and Development Journal (2018) • Mindell, J.A. et al. (2015) Sleep Medicine • PSI Warning Signs Checklist (2022) • Yoo, S.S. et al. (2007) Current Biology",
  ),
  phase(
    "Month 6", "ช่วงเปลี่ยนแปลงอีกครั้ง",
    "เมื่อเข้าสู่ช่วง 6 เดือน ลูกน้อยเริ่มมีพัฒนาการใหม่ ๆ และอาจเริ่มรับประทานอาหารเสริม ทำให้คุณแม่หลายคนรู้สึกกังวลหรือกดดันมากขึ้น บางครั้งอาจเผลอเปรียบเทียบพัฒนาการของลูกกับเด็กคนอื่น หรือกังวลว่าตัวเองกำลังตัดสินใจได้ดีพอหรือไม่ ทั้งเรื่องการให้อาหาร การนอน หรือการเลี้ยงดูค่ะ",
    "หากคุณแม่กำลังลดการให้นมลง ฮอร์โมนออกซิโทซินและโปรแลกตินจะลดลงด้วยค่ะ ซึ่งอาจทำให้รู้สึกเศร้าหรืออารมณ์แปรปรวนได้โดยไม่คาดคิด นี่เป็นผลจากฮอร์โมนล้วนๆ ไม่ใช่ความอ่อนแอค่ะ",
    "หากรู้สึกเศร้า อารมณ์แปรปรวน หรือหมดกำลังใจหลังลดการให้นมหรือหย่านม และอาการไม่ดีขึ้นหรือรบกวนการใช้ชีวิต ลองกดปุ่ม 💗 มุมจอเพื่อดูช่องทางขอความช่วยเหลือที่เหมาะกับคุณได้เสมอนะคะ\n• อารมณ์ดิ่งลงอย่างรวดเร็วหลังจากลดการให้นม\n• รู้สึกเศร้าหรือซึมลึกๆ ที่ดูเหมือนความเหนื่อยล้าแต่ไม่หายไป\n• วิตกกังวลมากจนแยกจากลูกไม่ได้เลยแม้แต่ช่วงสั้นๆ",
    "• หากอยู่ในช่วงหย่านม แนะนำให้ค่อย ๆ ลดลงอย่างช้า ๆ ตามความเหมาะสมนะคะ\n• พัฒนาการของลูกเป็นเรื่องเฉพาะตัว ลูกแต่ละคนมีเส้นทางการเติบโตที่ไม่เหมือนกันค่ะ\n• ถ้ารู้สึกเศร้าหลังหย่านม ลองคุยกับคุณหมอดูได้นะคะ มีคนพร้อมช่วยดูแลเสมอค่ะ\n• อย่าลืมให้กำลังใจตัวเองนะคะ คุณแม่กำลังเรียนรู้และเติบโตไปพร้อมกับลูก ไม่มีวิธีเลี้ยงลูกที่สมบูรณ์แบบสำหรับทุกครอบครัว",
    "Susman, E.J. et al. (2020) Psychoneuroendocrinology • NICE Assessment Criteria for Chronic Perinatal Depression (2021) • Academy of Breastfeeding Medicine (ABM) Clinical Protocol (2020) • NHS Community Health Postnatal Guidelines (2023)",
  ),
  phase(
    "Month 7–9", "ช่วงที่ลูกเริ่มเคลื่อนไหวได้",
    "ช่วงนี้ลูกน้อยเริ่มคลาน นั่ง หรือเกาะยืนได้มากขึ้น ทำให้ต้องการการดูแลอย่างใกล้ชิดกว่าเดิม คุณแม่หลายคนจึงอาจรู้สึกเหนื่อยล้าสะสม ต้องคอยระวังความปลอดภัยของลูกอยู่ตลอดเวลา บางครั้งอาจรู้สึกว่ามีเวลาให้ตัวเองน้อยลง หรือรู้สึกขัดแย้งระหว่างบทบาทของการเป็นคุณแม่กับความต้องการดูแลตัวเอง ความรู้สึกเหล่านี้เกิดขึ้นได้กับคุณแม่หลายคน และอาจเป็นสัญญาณว่าถึงเวลาหันกลับมาดูแลทั้งร่างกายและจิตใจของตัวเองมากขึ้นค่ะ",
    "เมื่อลูกตัวโตขึ้น การอุ้ม การพยุง และการเล่นกับลูกอาจทำให้ร่างกายทำงานหนักกว่าเดิม คุณแม่หลายคนจึงอาจมีอาการปวดหลัง ปวดไหล่ ปวดคอ หรือปวดข้อมือจากการอุ้มลูกและทำกิจกรรมซ้ำ ๆ ความเหนื่อยล้าทางร่างกายอาจส่งผลให้รู้สึกหงุดหงิด อ่อนล้า หรือรับมือกับความเครียดได้ยากขึ้นค่ะ",
    "ภาวะซึมเศร้าหลังคลอด (Post Partum Depression: PPD) สามารถเกิดขึ้นได้ภายใน 1 ปีหลังคลอด หากอาการต่อไปนี้เป็นต่อเนื่องนานกว่า 2 สัปดาห์ หรือรบกวนการใช้ชีวิตประจำวัน ควรปรึกษาแพทย์ พยาบาล หรือบุคลากรสุขภาพนะคะ หรือลองกดปุ่ม 💗 มุมจอเพื่อดูช่องทางขอความช่วยเหลือที่เหมาะกับคุณได้เสมอนะคะ\n• รู้สึกเศร้า หมดหวัง หรือหมดกำลังใจเกือบตลอดเวลา\n• ไม่อยากพบปะผู้คน หรือหลีกเลี่ยงการทำกิจกรรมที่เคยชอบ\n• รู้สึกเฉยชา ไม่มีความสุข หรือไม่สามารถเพลิดเพลินกับการใช้เวลากับลูกได้\n• หากมีความคิดทำร้ายตนเองหรือทำร้ายลูก ควรรีบขอความช่วยเหลือทันที หรือกดปุ่ม 💗 มุมจอตอนนี้เลยนะคะ เพื่อเลือกวิธีขอความช่วยเหลือที่เหมาะกับคุณ",
    "• หาเวลาสั้น ๆ ในแต่ละวันเพื่อดูแลตัวเอง แม้เพียง 10–15 นาที เช่น ยืดเหยียดร่างกาย พักผ่อน หรือทำกิจกรรมที่ช่วยให้รู้สึกผ่อนคลาย\n• หากรู้สึกเหนื่อยจากการต้องคอยดูแลลูกตลอดเวลา ลองขอให้คนใกล้ชิดช่วยดูแลลูกเป็นช่วง ๆ เพื่อให้คุณแม่ได้พักและฟื้นพลัง\n• หากมีนัดตรวจสุขภาพหรือพาลูกไปพบแพทย์ อย่าลืมเล่าให้บุคลากรสุขภาพฟังว่าช่วงนี้คุณแม่รู้สึกอย่างไรบ้าง เพราะสุขภาพจิตของคุณแม่ก็สำคัญไม่แพ้สุขภาพของลูก\n• อย่าลืมให้ความสำคัญกับตัวเองนะคะ การดูแลตัวเองไม่ใช่ความเห็นแก่ตัว แต่เป็นส่วนสำคัญที่ช่วยให้คุณแม่มีพลังในการดูแลลูกได้อย่างต่อเนื่อง",
    "Beeber, L.S. et al. (2014) Research in Nursing & Health • PSI Clinical Data (2023) • AAFP Guidelines on Late Postpartum Care (2022) • CDC Maternal Health and Postpartum Recovery Indicators (2021)", EPDS_PROMPT,
  ),
  phase(
    "Month 10–12", "ใกล้ครบหนึ่งปีแล้วค่ะ",
    "เมื่อใกล้ครบหนึ่งปีหลังคลอด คุณแม่หลายคนอาจมีความรู้สึกหลากหลายเกิดขึ้นพร้อมกัน ทั้งความภูมิใจที่ผ่านช่วงเวลาท้าทายมาได้ ความสุขเมื่อเห็นลูกเติบโต รวมถึงความเหนื่อยล้าหรือความทรงจำจากช่วงหลังคลอดที่อาจย้อนกลับมาในบางช่วง โดยเฉพาะเมื่อใกล้วันเกิดปีแรกของลูก ความรู้สึกเหล่านี้เป็นเรื่องที่เกิดขึ้นได้ และไม่ได้หมายความว่าคุณแม่กำลังถดถอยหรืออ่อนแอลง แต่เป็นส่วนหนึ่งของการทบทวนและปรับตัวกับประสบการณ์สำคัญในชีวิตค่ะ",
    "แม้ว่าระดับฮอร์โมนส่วนใหญ่จะกลับเข้าสู่ภาวะสมดุลแล้ว แต่ร่างกายยังคงต้องการการฟื้นฟูอย่างต่อเนื่อง คุณแม่บางรายอาจมีภาวะขาดธาตุเหล็ก วิตามินดี หรือสารอาหารอื่น ๆ โดยเฉพาะหากยังให้นมบุตรหรือพักผ่อนไม่เพียงพอ ซึ่งอาจทำให้รู้สึกอ่อนเพลีย ไม่มีแรง หรือส่งผลต่ออารมณ์ได้ หากมีอาการเหนื่อยผิดปกติ ควรปรึกษาแพทย์เพื่อรับการประเมินค่ะ",
    "แม้จะใกล้ครบหนึ่งปีหลังคลอด ภาวะซึมเศร้าหลังคลอดก็ยังสามารถเกิดขึ้นหรือคงอยู่ได้ หากอาการต่อไปนี้เป็นต่อเนื่องนานกว่า 2 สัปดาห์ หรือรบกวนการใช้ชีวิต ลองกดปุ่ม 💗 มุมจอเพื่อดูช่องทางขอความช่วยเหลือที่เหมาะกับคุณได้เสมอนะคะ\n• รู้สึกเศร้า หมดหวัง หรือหมดกำลังใจเกือบทุกวัน\n• ความทรงจำเกี่ยวกับการตั้งครรภ์หรือการคลอดย้อนกลับมาจนทำให้รู้สึกทุกข์หรือวิตกกังวลมาก โดยเฉพาะเมื่อใกล้วันเกิดของลูก\n• หลีกเลี่ยงการพูดถึงหรือเผชิญกับเรื่องที่เกี่ยวข้องกับการคลอด เพราะทำให้รู้สึกไม่สบายใจอย่างมาก\n• หากมีความคิดทำร้ายตนเองหรือทำร้ายลูก — กดปุ่ม 💗 มุมจอตอนนี้เลยนะคะ เพื่อเลือกวิธีขอความช่วยเหลือที่เหมาะกับคุณ",
    "• อยากให้คุณแม่ค่อย ๆ รับรู้ถึงความพยายามของตัวเองนะคะ เพราะหนึ่งปีที่ผ่านมานั้นไม่ง่ายเลยจริง ๆ ค่ะ\n• หากช่วงใกล้วันเกิดของลูกแล้วรู้สึกหนักขึ้น ลองแบ่งปันความรู้สึกกับคนที่ไว้ใจได้นะคะ จะช่วยให้เบาลงได้ค่ะ\n• ในการพบแพทย์ครั้งต่อไป อาจลองปรึกษาเรื่องการตรวจระดับธาตุเหล็กและวิตามินดีเพิ่มเติมได้นะคะ",
    "Beck, C.T. (2006/2021) Nursing Research • APA DSM-5 Criteria for Postpartum PTSD (2013) • Royal College of Psychiatrists Clinical Guide to Perinatal Mental Health (2023) • Postpartum Nutritional Status Review (2019)",
  ),
];

const EPDS_PROMPT_EN = "It is time for an emotional check. The EPDS is a tool that helps assess your mood and feelings after birth. It takes only a few minutes, and there are no right or wrong answers. Answer based on how you have truly felt over the past 7 days so your care team can offer appropriate guidance.";

const englishPhase = (index, title, feel, body, watchOut, tips, epdsPrompt = null) => ({
  ...CARE_JOURNEY_TH[index], title, feel, body, watchOut, tips, epdsPrompt,
});

export const CARE_JOURNEY_EN = [
  englishPhase(
    0, "The first days of motherhood",
    "During these first 3 days, you may feel happy and excited to meet your baby, while also feeling so exhausted that you have no energy or worrying whether you can care for your baby well enough. These mixed feelings happen to almost every mother and do not mean anything is wrong.",
    "Your body is making a major adjustment. Hormone levels that stayed high throughout pregnancy drop quickly after birth and can directly affect your emotions. Fatigue and physical discomfort from birth can also make things feel emotionally heavier.",
    "If sadness, anxiety, or hopelessness continues for more than 2 weeks or begins to affect daily life, tap the 💗 button in the corner to see support options that fit you.\n• Feeling confused or having unusual recurring thoughts\n• Hearing or seeing things other people do not\n• Severe agitation that feels impossible to stop\n• Feeling very sleepy but being unable to sleep even when the baby is asleep",
    "• Rest as much as you can, even in short stretches; it still matters.\n• You do not have to carry everything alone. Let people around you help.\n• If you need to cry, it is okay to cry.\n• When you have time, try gentle exercise, yoga, or stretching to help your body and mind relax.",
  ),
  englishPhase(
    1, "When emotions may fluctuate most",
    "During this time, many mothers feel more emotional ups and downs than usual. You may cry without knowing why, become irritable easily, or worry about small things. This is called Baby Blues, which affects up to 80% of mothers and usually improves on its own within the first 1–2 weeks after birth.",
    "After birth, your body is making a major adjustment. Hormone levels drop quickly, while caring for your baby can interrupt sleep. Physical discomfort, such as breast engorgement or pain from birth, can make it normal to feel tired, emotionally sensitive, or more sensitive to stress than usual.",
    "Baby Blues usually improves on its own. If you notice these signs, tap the 💗 button in the corner to see support options that fit you.\n• You do not want to be near or touch your baby\n• You feel so stressed or anxious that you cannot care for your baby safely at that moment",
    "• Allow yourself to feel what you feel; you do not have to be strong all the time.\n• If you can, tell someone close what you need—quiet space or simply someone sitting beside you.\n• If you can, drink water, eat a little, stretch, and rest when possible. When your body is cared for, your mind can gradually recover too.",
  ),
  englishPhase(
    2, "When people around you return to normal life",
    "When people who used to help return to work or go home, you may feel more lonely, tired, or unsure about caring for your baby. Repeating the same tasks every day and not getting enough rest can feel discouraging. Many mothers experience these feelings, and they do not mean you are caring for your baby badly.",
    "It is normal to feel tired and emotionally sensitive when you are not getting enough sleep. Some mothers also experience postpartum changes in thyroid function, which can cause unusual fatigue or mood changes. If symptoms do not improve or begin to affect daily life, talk with a doctor for an assessment.",
    "If these feelings continue for more than 2 weeks after birth, tap the 💗 button in the corner to see support options that fit you.\n• Crying or a low mood that continues without improving\n• Feeling unhappy about everything, even things you used to enjoy\n• Thoughts of hurting yourself or your baby—tap the 💗 button now to choose the right support",
    "• When you are ready, share how you feel with someone you trust.\n• If you can, step outside for a little gentle daylight.\n• Remember that asking for help does not mean you are weak.",
    EPDS_PROMPT_EN,
  ),
  englishPhase(
    3, "A major adjustment period",
    "Life may feel very different during this time. You may feel tired, lonely, or conflicted between your love for your baby and your need for time to rest. You may also feel more irritable or dissatisfied with things around you than usual. These feelings can happen while adjusting to motherhood and do not mean you are a bad mother.",
    "Hormone levels are moving closer to balance, but your body is still recovering after birth. Many mothers experience more hair loss than usual because of hormonal changes. This is common and often improves with time, so try not to worry too much.",
    "This is an important time to care for your mental health. If you notice these signs, tap the 💗 button in the corner to see support options that fit you.\n• Unwanted intrusive thoughts about accidentally hurting your baby\n• Withdrawing from people around you and not wanting to see anyone\n• Being unable to sleep no matter how tired your body feels",
    "• If you have a six-week postpartum check-up, remember to tell your doctor or nurse how you have been feeling.\n• If you can, take a short break to rest or do something you enjoy.\n• Mixed or confusing feelings can happen during this adjustment period.",
    EPDS_PROMPT_EN,
  ),
  englishPhase(
    4, "Transitioning into a new life",
    "Many mothers feel accumulated fatigue from caring for a baby continuously. You may sometimes feel drained or worry about returning to work and balancing baby care with daily life. These feelings are understandable because adjusting to motherhood takes time, and you do not have to handle everything alone.",
    "Some mothers experience postpartum changes in thyroid function, which can cause tiredness or mood changes. If unusual symptoms continue, talk with a doctor. Postpartum hair loss is also common because of hormonal changes. It may affect your confidence, but it generally improves on its own.",
    "If sadness, anxiety, or hopelessness continues for more than 2 weeks or begins to affect daily life, tap the 💗 button in the corner to see support options that fit you.\n• Feeling unusually angry or quick-tempered, even surprising yourself\n• Repetitive behaviors you cannot stop, such as checking your baby's breathing all night\n• Deep depression hidden beneath anger or exhaustion\n• Frequent guilt or self-blame, thinking you are a bad mother or are not doing enough\n• Anxiety that makes it hard to relax even when someone is helping with the baby",
    "• If you feel very angry or overwhelmed, place your baby somewhere safe and give yourself a moment.\n• Talk with someone you trust about what is worrying you.\n• Feelings during this period do not mean you love your baby any less.",
  ),
  englishPhase(
    5, "When your baby changes again",
    "Around months 4–5, many babies begin changing their sleep or daily routines. You may need to wake more often and feel exhausted from sleep loss again. Some days you may feel discouraged, hopeless, or unsure whether you are doing well enough. These feelings can happen during adjustment, and your baby's changes are a natural part of development—not your fault.",
    "Accumulated sleep loss and fatigue can make everything feel harder than before. When your body does not get enough rest, managing emotions and stress can also become harder. It is normal to feel sensitive, tired, or drained on some days. These are natural body responses and do not mean you are not strong or are caring for your baby badly.",
    "If any of these feelings continue for several days, become more intense, or interfere with daily life and caring for your baby, talk with a doctor, nurse, or health professional. If you need urgent guidance, tap the 💗 button in the corner to see support options that fit you.\n• Feeling sad, empty, or hopeless most of the time\n• Feeling numb, unhappy, or unable to enjoy caring for your baby or things you used to like\n• Frequent anger or irritability that is hard to control and affects baby care or relationships\n• Ongoing conflict with a partner or family that feels increasingly difficult to manage\n• Thoughts of hurting yourself or your baby, or feeling that life has no value—tap the 💗 button now to choose the right support",
    "• Ask someone to care for the baby so you can sleep for at least 4–5 hours continuously.\n• Difficult periods pass one day at a time.\n• If you feel exhausted, tell your family. You do not have to handle this alone.\n• Set aside 10–15 minutes a day for something relaxing, such as music, stretching, a walk, or slow breathing.",
  ),
  englishPhase(
    6, "Another period of change",
    "Around 6 months, your baby may reach new developmental stages and begin solid foods. Many mothers feel more worried or pressured, compare their baby's development with other children, or question whether they are making the right decisions about feeding, sleep, or parenting.",
    "If you are reducing breastfeeding, oxytocin and prolactin levels may also decrease. This can unexpectedly affect your mood or make you feel sad. This is a hormonal effect, not a weakness.",
    "If sadness, mood changes, or hopelessness continue after reducing feeds or weaning, or do not improve or interfere with daily life, tap the 💗 button in the corner to see support options that fit you.\n• A rapid mood drop after reducing breastfeeding\n• Deep sadness that feels like tiredness but does not go away\n• Anxiety so strong that you cannot separate from your baby even briefly",
    "• If you are weaning, reduce feeds gradually and in a way that suits you.\n• Your baby's development is individual; every child grows along a different path.\n• If you feel sad after weaning, talk with your doctor. Support is available.\n• Remember to encourage yourself. You are learning and growing with your baby, and there is no perfect parenting method for every family.",
  ),
  englishPhase(
    7, "When your baby becomes more mobile",
    "Your baby may begin crawling, sitting, or pulling up more often, which means they need closer supervision. Many mothers feel increasingly tired and must stay alert to their baby's safety. You may have less time for yourself or feel conflicted between being a mother and caring for your own needs. These feelings are common and may be a sign that it is time to care for both your body and mind.",
    "As your baby grows, lifting, supporting, and playing may place more strain on your body. Many mothers develop back, shoulder, neck, or wrist pain from carrying the baby and repeating the same activities. Physical fatigue can make you irritable, drained, or less able to manage stress.",
    "Postpartum depression can begin within the first year after birth. If these symptoms continue for more than 2 weeks or interfere with daily life, talk with a doctor, nurse, or health professional. You can also tap the 💗 button in the corner to see support options that fit you.\n• Feeling sad, hopeless, or discouraged most of the time\n• Not wanting to meet people or avoiding activities you used to enjoy\n• Feeling numb, unhappy, or unable to enjoy time with your baby\n• If you think about hurting yourself or your baby, seek help immediately or tap the 💗 button now to choose the right support",
    "• Make a little time each day to care for yourself, even 10–15 minutes of stretching, rest, or something relaxing.\n• If caring for your baby all day leaves you exhausted, ask someone close to share supervision so you can rest and regain energy.\n• If you have a health check-up or take your baby to see a doctor, tell the health professional how you have been feeling. Your mental health matters as much as your baby's health.\n• Remember that caring for yourself is not selfish; it helps you keep caring for your baby.",
    EPDS_PROMPT_EN,
  ),
  englishPhase(
    8, "Approaching the first year",
    "As you approach one year after birth, many feelings may arrive together: pride in getting through a challenging time, happiness as your baby grows, and fatigue or memories from the postpartum period that return at times—especially near your baby's first birthday. These feelings are understandable and do not mean you are going backward or becoming weaker. They are part of reflecting on and adjusting to an important life experience.",
    "Although most hormone levels have returned closer to balance, your body still needs ongoing recovery. Some mothers may have low iron, vitamin D, or other nutrients, especially if they are breastfeeding or not resting enough. This can cause unusual fatigue, low energy, or mood changes. If you feel unusually tired, talk with a doctor for an assessment.",
    "Postpartum depression can still begin or continue near the end of the first year. If symptoms continue for more than 2 weeks or interfere with daily life, tap the 💗 button in the corner to see support options that fit you.\n• Feeling sad, hopeless, or discouraged almost every day\n• Pregnancy or birth memories returning and causing distress or intense anxiety, especially near your baby's birthday\n• Avoiding talking about or facing birth-related experiences because they feel deeply upsetting\n• If you think about hurting yourself or your baby, tap the 💗 button now to choose the right support",
    "• Take time to recognize your own effort; the past year has not been easy.\n• If things feel heavier around your baby's birthday, share your feelings with someone you trust.\n• At your next medical visit, consider asking whether your iron and vitamin D levels should be checked.",
  ),
];

export const CARE_JOURNEY_HOTLINE = "หากรู้สึกหนักเกินรับไหว สายด่วนสุขภาพจิต 1323 พร้อมรับฟังตลอด 24 ชั่วโมง";
