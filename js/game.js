window.resizeiframe = function() {
    $('#myiframe').each(function() {
        if ($(this).data("last-height") == this.height) {
            return;

        }
        this.height = this.contentWindow.document.body.scrollHeight;
        $(this).data("last-height", this.height);
    })
}

var lastWindowHeight = 0;
var lastWindowWidth = 0;

$(window).resize(function(e) {
    if (!e.originalEvent) {

    } else if ($(window).height() != lastWindowHeight || $(window).width() != lastWindowWidth) {
        lastWindowHeight = $(window).height();
        lastWindowWidth = $(window).width();
    } else {
        return;
    }

    if ($(window).data("first-load") === undefined) {
        $('body').animate({
            opacity: 1
        }, 500);
    }

    $('.table-row').each(function() {
        $(this).css("display", "block");
        var width = $(this).width();
        var count = $(this).children().length
        var cell_width = 1.0 * (width) / count
        $(this).children().css({
            width: cell_width
        });
        $(this).css("display", "table");
    });

    var number_of_rows = $('#question-grid .table-row').length;

    if ($("#categories textarea").length == 0) {
        // resize the category boxes;
        var min_font_size = 12;
        var max_font_size = 24;
        var height = $(window).height() / (number_of_rows + 1)
        var max_height = height;
        var new_max_height = 0;
        $("#categories .table-cell").css({
            height: 1
        });
        $("#categories .table-cell-inner").each(function() {
            var max_width = $(this).width()
            var font_size = 24;

            do {
                $(this).css("font-size", font_size);
                var w = this.scrollWidth
                var h = this.scrollHeight;
                if (w <= max_width && h <= max_height) {
                    new_max_height = Math.max(new_max_height, h);
                    break;
                }
                font_size--;
            } while (font_size);
        });

        $("#categories .table-cell").css({
            height: new_max_height
        });

    }

    var top = $('#question-grid').offset().top;
    var border_bottom_width = 10 + 2 * parseInt($('#question-grid .table-row:last-child').css("border-bottom-width"), 10)
    var bottom = $(window).height();

    if ($("#teams:visible").length) {
        bottom = ($('#teams').offset().top) + ((bottom - top - border_bottom_width) / Math.max(5, number_of_rows)) / 4;
    }

    var height_per_row = (bottom - top - border_bottom_width) / Math.max(5, number_of_rows);
    $('#question-grid .table-cell').each(function() {
        $(this).css("height", height_per_row);
    });

    window.resizeiframe();
});
$(document).ready(function() {
    $(window).resize();
    $('#add-row').click(function() {
        if (!window.LOGGED_IN) {
            modal2.show();
        } else {
            var row = $('#question-grid').find(".table-row:first-child").clone();
            $('#question-grid').append(row);
            var row_number = $('#question-grid .table-row').length
            row.find("h3").text((row_number) * 100)
            row.find("textarea").val("");
            row.find("textarea").each(function() {
                var name = $(this).attr('name');
                name = name.replace(/(.*)\[(\d+)\]\[(\d+)\]/, "$1[" + (row_number - 1) + "][$3]")
                $(this).attr("name", name);
            });
            row.find(".table-cell").addClass("empty");
            $(window).resize();
        }
    });

    $('#add-column').click(function() {
        if (!window.LOGGED_IN) {
            modal2.show();
        } else {
            var row = $('#question-grid').find(".table-row").each(function() {
                var clone = $(this).find(".table-cell:last-child").clone();
                $(this).find(".table-cell:last-child").after(clone);
                var col = $(this).find(".table-cell").length;
                clone.find("textarea").val("");
                clone.addClass("empty");
                clone.find("textarea").each(function() {
                    var name = $(this).attr('name');
                    name = name.replace(/(.*)\[(\d+)\]\[(\d+)\]/, "$1[$2][" + (col - 1) + "]")
                    $(this).attr("name", name);
                });

            });
            // add the cateogry
            var clone = $('#categories').find(".table-cell:first-child").clone();
            $('#categories').find(".table-cell:last-child").after(clone);
            clone.find("textarea").val("Enter Category");
            clone.find("textarea").addClass("empty");
            var col = $('#categories .table-cell').length;
            clone.find("textarea").attr("name", "category[" + (col - 1) + "]");

            $(window).resize();
            $(window).resize();
        }
    });

});

if (window.MathJax) {
    MathJax.Hub.Config({
        asciimath2jax: {
            delimiters: [
                ['`', '`']
            ],
            skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "body"]
        }
    });
}

$(document).ready(function() {
    if (window.MathJax) {
        $('.mathy').each(function() {
            this.innerText = '`' + this.innerText + '`';
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
        })
    }

});

var game = {}
game.init = function() {
    var val = $('#options select').val();
    $('#options').hide();
    var teams = $('#teams .team');
    for (var i = 0; i < val; i++) {
        $(teams[i]).show();
    }
    $('#gameplay').css("filter", "blur(0px)");
    $(window).resize();
}

function capSizes(el, max_width) {
    return
    var treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, null, false);
    while (treeWalker.nextNode()) {
        node = treeWalker.currentNode;
        if (node.tagName == "IMG" && !node.complete) {
            node.style.maxWidth = "0";
        } else {
            try {
                node.style.maxWidth = max_width + "px";
            } catch (e) {

            }
        }
    }

}

function trimHTML(el) {
    var treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
    while (treeWalker.nextNode()) {
        var node = treeWalker.currentNode;
    }
    var nodes_to_delete = [];
    do {
        var node = treeWalker.currentNode;
        if (node.nodeType == 3 && $.trim(node.data) == "") {
            nodes_to_delete.push(node);
        } else if (node.tagName == "SCRIPT") {

        } else if (node.tagName == "BR") {
            nodes_to_delete.push(node);
        } else if (node.tagName == "P" && $.trim($(node).text()) == "") {
            nodes_to_delete.push(node);
        } else {
            break;
        }
    } while (treeWalker.previousNode())
    for (var i = 0; i < nodes_to_delete.length; i++) {
        $(nodes_to_delete[i]).remove();
    }

}

function calculateSize(el) {
    var max_width = Math.floor($(window).width() * .9);
    var max_height = (($('#teams').offset().top || $(window).height()) - $(el).offset().top) / 2.0;
    var html = el.innerHTML
    var text = $(el).text();

    var div = document.createElement("div");
    div.className = "answer-wrapper"
        //div.style.opacity = 0;
    div.style.display = "block";
    div.style.overflowX = "auto";
    div.style.position = "absolute";
    div.style.left = "0";
    div.style.top = "0";
    div.style.zIndex = 1000;
    //div.style.wordWrap = "break-word";
    div.style.width = max_width + "px";
    // first, scale the text
    div.innerText = text.replace(/\n/g, '');
    if (html.indexOf("mathy") != -1) {
        //debugger;
    }

    var body = $('body').get(0);
    body.appendChild(div);
    font_size = 100; //getComputedStyle(div)['fontSize'])
    do {
        div.style.fontSize = font_size + "px";
        //var bbox = div.getBoundingClientRect();
        var w = div.offsetWidth
        var h = div.offsetHeight;
        //w += div.scrollWidth - div.offsetWidth
        //var scale = Math.min(1, Math.min(1.0*max_width/w, 1.0*max_height/h));
        if (w <= max_width && h <= max_height) {
            break;
        }
        font_size--;
    } while (font_size);

    /*
    // now try to scale the rest of the stuff
    div.innerHTML = html;
    capSizes(div, max_width);

    div.style.overflowX = "initial";
    //div.style.width = "auto";
    var bbox = div.getBoundingClientRect();
    var w = bbox.width;
    var h = bbox.height;
    var scale = Math.min(1, Math.min(1.0*max_width/w, 1.0*max_height/h));

    capSizes(el, max_width);
    //el.style.transform = "translate(0%, -50%) scale(" + scale + ") ";
    el.style.transform = "scale(" + scale + ") ";
    */
    div.parentNode.removeChild(div);
    el.style.fontSize = font_size + 'px';
    return font_size
}

var modal = function() {}

modal.reveal = function() {
    var q = $('#question-modal').find(".question")
    q.css({
        "display": "block",
    });

    function scrollTo(element, to, duration) {
        var start = element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20;

        var animateScroll = function() {
            currentTime += increment;
            var val = easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val;
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }

    //t = current time
    //b = start value
    //c = change in value
    //d = duration
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    var original_val = $('#question-modal .modal-inner').scrollTop()
    $('#question-modal .modal-inner').scrollTop(0)
    var val = $('#question-modal .question').offset().top - $('#question-modal .modal-inner').offset().top
    $('#question-modal .modal-inner').scrollTop(original_val)
    scrollTo($('#question-modal .modal-inner').get(0), val, 250)

    setTimeout(function() {
        q.addClass("reveal");
    }, 0)

    $('.active-question h3').css({
        "opacity": 0
    })
}

modal.show = function(cell) {
    $('.active-question').removeClass("active-question");
    $(cell).addClass("active-question");
    var position = $(cell).closest(".table-row").children().index(cell);
    var category = $($("#categories .table-cell").get(position)).text()
    var points = $(cell).attr("data-points");
    $('#question-title').text(category + " for " + points);
    var bbox = cell.getBoundingClientRect();
    $('#question-modal').css({
        "display": "block",
        "opacity": 0,
    })

    $('#question-modal .modal-inner').html(
        $(cell).find(".answer").prop("outerHTML") +
        $(cell).find(".question").prop("outerHTML")
    )

    $('#question-modal .modal2').scrollTop(0)

    trimHTML($('#question-modal .answer').get(0))
    trimHTML($('#question-modal .question').get(0))

    var font_size = calculateSize($('#question-modal .modal-inner').get(0))

    var h = ($('#teams').offset().top || $(window).height()) - $('#question-modal .modal2').offset().top - 20;
    $('#question-modal .modal-inner').css({
        maxHeight: h
    });
    $('#question-modal .modal2').css({
        height: h
    })

    $('#question-modal').css({
        transform: "translate(" + bbox.x + "px, " + bbox.y + "px) scale(" + (bbox.width / $(window).width()) + ", " + (bbox.height / $(window).height()) + ")",
        opacity: 1
    })

    $(window).on("keydown.question-modal", function(e) {
        var ESC = 27
        var SPACE = 32
        if (e.keyCode == ESC) {
            e.preventDefault();
            modal.hide();
        } else if (e.keyCode == SPACE) {
            e.preventDefault();
            modal.reveal();
        }
    });

    $('.expanded').removeClass("expanded");

    setTimeout(function() {
        $('#question-modal').addClass("expanded");
        $('#question-modal').css({
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100%',
            borderWidth: 0,
            transform: "translate(0px, 0px) scale(1)"
        });
    }, 1);

}

modal.hide = function() {
    $(window).off("keydown.question-modal");
    $('#question-modal').hide()
    $('#question-modal').removeClass("expanded");
    $('#question-modal').css({
        borderWidth: 3
    });
}

$(document).ready(function() {
    $('#question-modal').on("click", '#answer-button', function() {
        modal.reveal();
    })

    $('#question-modal').on("click", '#continue-button', function() {
        modal.hide();
    });

    $('#question-grid .table-cell:not(.empty)').on("click", function() {
        // figure out the point value of the thing that was clicked
        modal.show(this);
    });

    // prevent the buttons from being highlighted
    $('body').on("mousedown", ".minus, .plus", function(e) {
        e.preventDefault();
    });

    $('body').on("click", ".plus", function(e) {
        var $points = $(this).closest(".team").find(".points")
        var points = parseInt($points.text())
        var val = parseInt($(".active-question").attr("data-points") || 100);
        points += val;
        $points.text(points);

        $('.active-question h3').css({
            "opacity": 0
        })
    });

    $('body').on("click", ".minus", function(e) {
        var $points = $(this).closest(".team").find(".points")
        var points = parseInt($points.text())
        var val = parseInt($(".active-question").attr("data-points") || 100);
        points -= val;
        $points.text(points);

        $('.active-question h3').css({
            "opacity": 0
        })
    });

    $(window).resize();

});
