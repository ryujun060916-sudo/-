// Formspree endpoint: create a free form at https://formspree.io and replace YOUR_FORM_ID.
// Until then, submissions fall back to opening a pre-filled email to oomoridc@gmail.com.
const CONTACT_FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
const CONTACT_EMAIL = "oomoridc@gmail.com";

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const topicOtherWrap = document.getElementById("topic-other-wrap");
  const date1 = document.getElementById("c-date1");
  const time1 = document.getElementById("c-time1");
  const dateNote = document.getElementById("date-note");
  const statusText = document.getElementById("form-status");

  const defaultDateNote = "火曜は休診です。ご希望に沿えない場合は、近い日時をこちらからご提案します。";

  form.querySelectorAll('input[name="topic"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      topicOtherWrap.hidden = e.target.value !== "その他";
    });
  });

  const afternoonOption = time1.querySelector('option[value="afternoon"]');

  date1.addEventListener("change", () => {
    const val = date1.value;
    if (!val) {
      afternoonOption.textContent = "午後";
      dateNote.textContent = defaultDateNote;
      return;
    }
    const day = new Date(val + "T00:00:00").getDay();
    const isWeekend = day === 0 || day === 6;
    afternoonOption.textContent = isWeekend ? "午後 14:30 - 18:00" : "午後 15:00 - 19:00";
    if (day === 2) {
      dateNote.textContent = "選ばれた日は火曜（休診）です。別の日をお選びください。";
    } else {
      dateNote.textContent = isWeekend
        ? "土・日・祝の診療時間は 10:00 - 13:00 ／ 14:30 - 18:00 です。"
        : "平日の診療時間は 10:00 - 13:00 ／ 15:00 - 19:00 です。";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const get = (k) => (data.get(k) || "").toString().trim();
    data.append("_subject", "【HPお問い合わせ】" + get("name"));

    if (CONTACT_FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
      const body = [
        "お名前: " + get("name"),
        "フリガナ: " + get("kana"),
        "電話番号: " + get("tel"),
        "メールアドレス: " + get("email"),
        "ご用件: " + get("topic"),
        "ご希望の日時: " + get("date1") + " " + get("time1"),
        "",
        "お問い合わせ内容:",
        get("message"),
      ].join("\n");
      window.location.href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent("【HPお問い合わせ】" + get("name") + " 様") +
        "&body=" + encodeURIComponent(body);
      statusText.textContent = "送信しました。診療日の2営業日以内にご連絡します。";
      return;
    }

    statusText.textContent = "送信中です。そのままお待ちください。";
    try {
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error("send failed");
      form.reset();
      statusText.textContent = "送信しました。診療日の2営業日以内にご連絡します。";
    } catch (err) {
      statusText.textContent = "送信に失敗しました。お手数ですが、お電話（03-5753-8173）にてご連絡ください。";
    }
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);
