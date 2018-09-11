var id = 0;
var text = '';
var arr = [];
$(function(){ 
    //给输入框注册keypress事件
    $('.todo-text').on('keypress',function(e){
        if(e.keyCode == '13'){
            //通过复制获取隐藏的li，并复制li的所有事件（true）
            var new_li = $('.hidden').clone(true);
            text = $.trim($(e.target).val());                    
            addTodo(text,e,new_li);
            countTodo();                  
        };       
    });

    //给叉号注册click事件，并且委托给他的父级（因为新建的元素需要委托才能绑定事件）
    $('ul').on('click','li .del',function(e){
        // alert('lkajg');
        $(this).parent().remove();
        // var _this = $(this);   提前保存this
        arr.forEach(function(item,index){
            // console.log($(this));  此时$(this)是window，所以下面用e.target。也可以提前保存:var _this = $(this)
            if( item.id == $(e.target).parent().data('id') ){
                arr.splice(index,1);
            }
        })        
        countTodo();
    });

    //给完成按钮添加click事件，并且委托给他的父级ul
    $('ul').delegate('li .completed','click',function(e){
        if($(this).is(':checked')){
            $(this).siblings('.todo').addClass('line');
            changeArrState($(this).parent().data('id'));
        }else{
            $(this).siblings('.todo').removeClass('line');
            changeArrState($(this).parent().data('id'));
        }
        countTodo();
    });

    //给select-all添加click事件
    $('.select-all').on('click',function(){
        // alert('123');
        if($(this).is(':checked')){
            // $('ul li .completed').prop('checked','checked');
            // $('ul li .todo').addClass('line');

            //相当于点击了一下所有li的完成按钮，这种写法不行
            // $('.todos li .completed').click();
            $('.todos li .completed:not(:checked)').click();

        }else{
            // $('ul li .completed').prop('checked','');
            // $('ul li .todo').removeClass('line');

            //相当于点击了一下所有li的完成按钮，这种写法不行
            // $('.todos li .completed').click();
            $('.todos li .completed:checked').click();
        }
    })

    //给状态按钮（all active completed）绑定点击事件
    $('.state li').on('click',function(e){
        $(this).css('border','1px solid #fff').siblings().css('border','0 none');
        if($(e.target).hasClass('all')){
            $('.todos li').show();
        }else if($(e.target).hasClass('active')){
            $('.todos .completed:checked').parent().hide();
            $('.todos .completed:not(:checked)').parent().show();

        }else{
            $('.todos .completed:not(:checked)').parent().hide();
            $('.todos .completed:checked').parent().show();
        }
    })

})


function addTodo(text,e,new_li){
    if(text){
        addArr(id,text);
        //是指data- 属性，利用data()方法获取
        new_li.attr('data-id',String(id));
        id++;
        $(e.target).val('');
        new_li.find('.todo').text(text);
        new_li.removeClass('hidden');
        new_li.addClass('new-li');
        $('.todos').prepend(new_li);
    }else{
        alert('内容不能为空！！')
    }
};

function addArr(id,text){
    arr.push({
        id : id,
        text : text,
        completed : false 
    });
};

function countTodo(){   
    var count = 0; 
    arr.forEach(function(item){
        if(!item.state){
            count++
        }
    })
    $('.footer label span').text(count);
};

function changeArrState(id){
    arr.forEach(function(item){
        if(item.id == id){
            item.state = !item.state;
        }
    })
    countTodo();
}