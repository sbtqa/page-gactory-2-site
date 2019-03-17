function iframeHash() {
    window.location.hash = document.getElementById('doc').contentWindow.location.hash;
    console.log(window.location.hash);
}


function iframeHashListener() {
    document.getElementById('doc').contentWindow.document.body.addEventListener("hashchange", iframeHash);
    document.getElementById('doc').contentWindow.addEventListener("hashchange", iframeHash);
}

function setVersion(version) {
    document.title = "TAG documentation (" + version + ")";
    $('#doc').attr("src", "releases/" + version + "/index.html");
}


$.getJSON("https://api.github.com/repositories/172893709/contents/releases", function (data) {
    const options = [];
    $.each(data, function (key, version) {
        options.push(version.name);
    });
    $('#versions').selectmenu({
        change: function (event, ui) {
            setVersion(ui.item.value);
        }
    });
    $('#versions')
        .append(options.map(function (version) { return "<option value=" + version + ">" + version + "</option>" }).join(""));

    const latestRelease = options.length > 1 ? options[options.length - 2] : "snapshot";

    $('#versions').val(latestRelease);
    $('#versions').selectmenu("refresh");
    setVersion(latestRelease);
});
