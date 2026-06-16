window.askAI = function () {

  const q =
    document.getElementById("question")
    .value
    .toLowerCase();

  let answer =
    "I don't understand yet.";

  if (q.includes("sales")) {

    answer =
      "Check dashboard sales metrics.";

  }

  if (q.includes("stock")) {

    answer =
      "Check low stock alerts section.";

  }

  if (q.includes("customer")) {

    answer =
      "Open customers page.";

  }

  document.getElementById("answer")
    .innerText = answer;
}