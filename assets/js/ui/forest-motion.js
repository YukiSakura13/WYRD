export function createForestMotion(root = document) {
  const cards = Array.from(root.querySelectorAll(".forest-art-card"));

  if (!cards.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    cards.forEach(function showMotion(card) {
      card.classList.add("is-in-view");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function updateVisibleCards(entries) {
      entries.forEach(function updateCard(entry) {
        entry.target.classList.toggle("is-in-view", entry.isIntersecting && entry.intersectionRatio >= 0.34);
      });
    },
    {
      root: root.getElementById("forest-home"),
      threshold: [0, 0.34, 0.7],
    },
  );

  cards.forEach(function observeCard(card) {
    observer.observe(card);
  });
}
