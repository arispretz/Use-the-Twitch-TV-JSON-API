$(function() {
  "use strict";

  let API_URL = "https://twitch-proxy.freecodecamp.rocks/helix",
      $n = $("nav a"),
      $f = $("#search"),
      $i = $("#input"),
      $s = $("#streams"),
      list = [
        "day9tv",
        "dreamhackcs",
        "eleaguetv",
        "esl_csgo",
        "esl_sc2",
        "freecodecamp",
        "pashaBiceps",
        "s1mple",
        "starcraft",
        "wcs_america"
      ];

  $n.on("click", e => showStreams(e));
  $i.on("input", e => searchStreams(e));
  $f.on("submit", e => searchStreams(e));

  for (let i = 0; i < list.length; i++) {
    displayStreamData(list[i]);  
  }

  function displayStreamData(channel) {
    $.getJSON(API_URL + "/streams?user_login=" + channel, data => {
      if (data.data && data.data.length > 0) {
        LIify(data.data[0], "live");
      } else {
        $.getJSON(API_URL + "/users?login=" + channel, data => {
          LIify(data.data[0]);
        });
      }
    });
  }

  function LIify(data, live = null) {
    let li = `<li id="${data.display_name}" ${live ? "class='live'" : ""}>`;
    li += `<div class='bg' style='background-image: url(${data.profile_image_url})'></div>`;
    li += `<div class='avatar'><img src='${data.profile_image_url}'></div>`;
    li += `<div class='info'>`;
    li += `<a href='https://www.twitch.tv/${data.login}' target='_blank'>`;
    li += `<div class='name'>${data.display_name}</div>`;
    li += live ? `<div class='stream'><strong>Streaming:</strong> ${data.title}</div>` :
          `<div class='stream'><strong>Last Stream:</strong> ${data.description}</div>`;
    li += `</a>`;
    li += `</div>`;
    li += `</li>`;
    $s.append(li);
  }

  function showStreams(e) {
    let $clicked = $("#" + e.target.id);
    $clicked.addClass("selected").siblings().removeClass("selected");
    switch (e.target.id) {
      case "live":
        $("#streams li:not(.live)").slideUp();
        $("#streams li.live").slideDown();
        break;
      case "offline":
        $("#streams li.live").slideUp();
        $("#streams li:not(.live)").slideDown();
        break;
      default:
        $("#streams li").slideDown();
    }
  }

  function searchStreams(e) {
    e.preventDefault();
    if ($i.val() === "") {
      $("#all").addClass("selected");
    } else {
      $n.removeClass("selected");
    }
    $s.children("li").each(function() {
      if ($(this).attr("id").toLowerCase().indexOf($i.val().toLowerCase()) === -1) {
        $(this).slideUp();
      } else {
        $(this).slideDown();
      }
    });
  }
});
