const HARDCODED_CLIENTS = 5000;
export async function getEmployeeCount() {
try {
    const response = await fetch("http://localhost:8080/employees/get-employee-count", {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`Помилка завантаження даних: ${response.statusText}`);
    }
    const data = await response.json();
    return data.employeeCount;  

} catch (error) {
    console.error(error);
    return [];
}
}
const empCounter = document.querySelector(".emp-counter");
if (empCounter) {
    getEmployeeCount().then(count => {
        empCounter.dataset.count = count;
        animateCounter(empCounter, count);  // Використовуємо count, отриманий із сервера
    });
}



// Встановлюємо кількість клієнтів у .client-counter (з "+")
const clientCounter = document.querySelector(".client-counter");
if (clientCounter) {
    clientCounter.dataset.count = HARDCODED_CLIENTS;
    animateCounter(clientCounter, HARDCODED_CLIENTS, true);
}

// Обчислення років роботи компанії
const yearofWork = new Date().getFullYear();
const yearCounter = document.querySelector(".yearofWork");
const StartYear = 1991;

if (yearCounter) {
    yearCounter.dataset.count = yearofWork - StartYear;
    animateCounter(yearCounter, yearofWork - StartYear);
}

// Анімація лічильника при скролі
$(document).ready(function () {
    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return elemBottom <= docViewBottom && elemTop >= docViewTop;
    }

    $(window).on("scroll", function () {
        $(".counter").each(function () {
            var $this = $(this);
            if (isScrolledIntoView($this) && !$this.hasClass("counted")) {
                $this.addClass("counted");
                var countTo = parseInt($this.attr("data-count")) || 0;
                var addPlus = $this.hasClass("client-counter");

                $({ countNum: 0 }).animate(
                    { countNum: countTo },
                    {
                        duration: 4000,
                        easing: "linear",
                        step: function () {
                            $this.text(Math.floor(this.countNum) + (addPlus ? " +" : ""));
                        },
                        complete: function () {
                            $this.text(this.countNum + (addPlus ? " +" : ""));
                        }
                    }
                );
            }
        });
    });
});

// Функція анімації лічильника
function animateCounter(element, countValue, addPlus = false) {
    $({ countNum: 0 }).animate(
        { countNum: countValue },
        {
            duration: 4000,
            easing: "linear",
            step: function () {
                element.textContent = Math.floor(this.countNum) + (addPlus ? " +" : "");
            },
            complete: function () {
                element.textContent = this.countNum + (addPlus ? " +" : "");
            }
        }
    );
}
