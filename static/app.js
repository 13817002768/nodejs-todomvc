
(function (Vue) {
	'use strict';



	var STOREGE_KEY = "todo-items";

	const itemStorage = {
		fetch:function () {
			// 获取数据并且数据反序列化，变成数组对象，如果为空，则是空数组
			return JSON.parse(localStorage.getItem(STOREGE_KEY) || '[]')
		},
		//保存数据到本地，items就是需要保存的数据源，并且以JSON字符串的格式存储
		save:function (items) {
			localStorage.setItem(STOREGE_KEY,JSON.stringify(items))
		}
	};

	// Your starting point. Enjoy the ride!
	var vm = new Vue({
		el:'#todoapp',
		data:{
			// items:[
			// 	{id:1,content:'dddd',completed:false},
			// 	{id:2,content:'aaaa',completed:false},
			// 	{id:3,content:'bbbb',completed:false},
			// 	{id:4,content:'cccc',completed:false},
			// ],

			items:itemStorage.fetch(),
			currentItem:null,
			filterState:'all',
			id:0,
			
		},

		

		// directives:{
		// 	"todo-focus":{
		// 		//当指令的值更新后会调用此方法
		// 		update(el,binding){
		// 			//el表示作用的元素
		// 			//binding表示指令后输入的内容
		// 			if(binding.value){
		// 				el.focus()
		// 			}

		// 		}

		// 	}
		// },

		watch:{
			//监听items，一旦items发生变化就会执行
			items:{
				deep:true,//需要监听数据对象内部的变化，需要指定deep：true
				handler(newitems,olditems){
					itemStorage.save(newitems)
				}
			}
		},

		methods:{
			addItem(event){
				//获取文本框输入的值
				const newValue = event.target.value.trim();

				if(!newValue.length){
					return
				}
				this.id = this.id +1;
				const newObject={
					id:this.id,
					content:newValue,
					completed:false
				};
				this.items.push(newObject);
				event.target.value = '';
				// window.location.href="/insert?id="+this.id+"&content="+newValue+"&completed=false";
				$.ajax({
					url:'/insert',
					type:'GET',
					data:newObject,
					success:function(text){
						//alert('成功');
					},
				});
			},

			// 删除列表中的item
			removeItem(index){
				//window.location.href="/delete?id="+this.items[index].id;
				$.ajax({
					url:'/delete',
					type:'GET',
					data:{id:this.items[index].id},
					success:function(text){
						//alert('成功');
					},
				});
				this.items.splice(index,1)
			},

			toEdit(item){
				this.currentItem=item
			},

			cancelEdit(){
				this.currentItem=null
			},
			
			// 修改一个item
			saveData(item,index,event){
				const content = event.target.value.trim();
				if(!content){
					this.removeItem(index)
				}
				item.content = content;
				//window.location.href="/update?id="+item.id+"&content="+content+"&completed="+item.completed;
				$.ajax({
					url:'/update',
					type:'GET',
					data:{id:item.id,content:content,completed:item.completed},
					success:function(text){
						//alert('成功');
					},
				});
				this.currentItem = null
			},

			removeAllCompleted(){
				this.items = this.items.filter((item)=>!item.completed)
			},

			
		},

		computed:{
			// 未完成任务个数
			incomplete(){
				return this.items.filter(item=>!item.completed).length
			},
			isSelectAll:{
				set:function(newState){
					this.items.forEach(function (item) {
						item.completed = newState;
					})
				},
				get:function () {
					return this.incomplete===0
				}
			},

			filterItems() {
				switch (this.filterState) {
					case "active":
						return this.items.filter(item=>!item.completed);
						break
					case "completed":
						return this.items.filter(item=>item.completed);
						break
					default:
						return this.items;
						break
				}
			},

		
		},


		//自定义局部指令，用于聚焦编辑框修改内容，当进入编辑模式的对象与传入的对象是同一个聚焦，防止聚焦到别处
		directives:{
			"todo-focus":{
				//当指令的值更新后会调用此方法
				update(el,binding){
					//el表示作用的元素
					//binding表示指令后输入的内容
					if(binding.value){
						el.focus()
					}
				}
			}
		},


	});

	window.onhashchange=function () {
		const hash = window.location.hash.substr(2) || 'all';
		vm.filterState = hash
	};

	window.onhashchange()

})(Vue);
