$(document).ready(function() {
    // Спочатку закриваємо всі елементи .content
    $(".content").hide();
    $(".set > a").removeClass("active");
    $(".set > a img").removeClass("accordeon-open"); // Стрілка спочатку повернута вгору

    $(".set > a").on("click", function() {
        if ($(this).hasClass("active")) {
            // Закриваємо, якщо вже відкрито
            $(this).removeClass("active");
            $(this).siblings(".content").slideUp(200);
            $(this).find("img").removeClass("accordeon-open"); // Змінюємо кут стрілки назад
        } else {
            // Закриваємо всі інші
            $(".set > a img").removeClass("accordeon-open"); // Змінюємо всі стрілки назад
            $(".set > a").removeClass("active");
            $(".content").slideUp(200);

            // Відкриваємо поточний елемент
            $(this).addClass("active");
            $(this).find("img").addClass("accordeon-open"); // Повертаємо стрілку вниз
            $(this).siblings(".content").slideDown(200);
        }
    });
});
