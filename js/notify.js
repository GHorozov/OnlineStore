let notify = (() => {

    $(document).on({
        ajaxStart: () => $("#loadingBox").show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.find('span').text(message);
        infoBox.fadeIn();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.find('span').text(message);
        errorBox.fadeIn();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    function handleError(reason) {
        let errorMsg = JSON.stringify(reason);
        if (reason.readyState === 0) {
            errorMsg = "Cannot connect due to network error.";
        }
        if (reason.responseJSON && reason.responseJSON.description) {
            errorMsg = reason.responseJSON.description;
        }
        showError(errorMsg);
    }

    return {
        showInfo,
        showError,
        handleError
    }
})();