test("indeterminate", function () {
    frameHtml({
        src:'/test/selector/not/not.html',
        ontest:function (w, f) {
            colorEqual('rgba(0, 0, 0, 0)', w.$('li').eq(0).css('background-color'));
            colorEqual('yellow', w.$('li').eq(1).css('background-color'));
            colorEqual('yellow', w.$('li').eq(2).css('background-color'));
            this.finish();
        }
    });
});
