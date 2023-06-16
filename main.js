
// строим график, доккументация https://www.amcharts.com/docs/v4/chart-types/xy-chart/
function plot() {
	let chart = am4core.create("chartdiv", am4charts.XYChart);

	chart.data = getChartData();

	//инициализация осей и заголовков
	let heightAxis = chart.xAxes.push(new am4charts.CategoryAxis());
	heightAxis.dataFields.category = "height";
	heightAxis.title.text = "[bold]Высота (толщина) детали h, мм";
	heightAxis.title.marginTop = 20;
	heightAxis.renderer.inversed = true;

	let pressureAxis = chart.yAxes.push(new am4charts.ValueAxis());
	pressureAxis.title.text = "[bold]Сила деформирования, кН";
	pressureAxis.title.marginRight = 20;

	pressureAxis.numberFormatter = new am4core.NumberFormatter();
	pressureAxis.numberFormatter.numberFormat = "#."; 

	//инициализация зависимости
	let series = chart.series.push(new am4charts.LineSeries());
	series.dataFields.valueY = "pressure";
	series.dataFields.categoryX = "height";

	//Кастомизация линии
	series.stroke = am4core.color("#00BB7D"); // red
	series.strokeWidth = 2;

	//Кастомизации подсказок
	series.tooltipText = "{categoryX.formatNumber('#.00')}: [bold]{valueY}[/]";
	heightAxis.tooltipText = "{category.formatNumber('#.00')}";

	// let series2 = chart.series.push(new am4charts.ColumnSeries());
	// series2.dataFields.valueY = "pressure";
	// series2.dataFields.categoryX = "height";


	// Кастомизация сетки
	heightAxis.renderer.grid.template.location = 0;

	// Кастомизация кусора
	chart.cursor = new am4charts.XYCursor();
	chart.cursor.lineX.stroke = am4core.color("#00BB7D");
	chart.cursor.lineX.strokeWidth = 2;
	chart.cursor.lineX.strokeOpacity = 0.5;
	chart.cursor.lineX.strokeDasharray = "";

	chart.cursor.lineY.disabled = true;


 	// document.getElementById('simulation').style.display = "flex";
 	// document.getElementById('chart-section').style.display = "block";

 	//скролинг к блоку
	const el = document.getElementById('simulation_block');
	el.scrollIntoView({behavior: "smooth"});
}



function getChartData(event) {
	//берем значения из инпутов
	let height = document.getElementById('height').value;
	let tetaS = document.getElementById('tetaS').value;
	let a2 = document.getElementById('a2').value;
	let a = document.getElementById('a').value;
	let b2 = document.getElementById('b2').value;
	let b = document.getElementById('b').value;

	//проверяем на корректно введеные значения
	if(!checkInputs(height,tetaS,a2,a,b2,b)) {event.preventDefault()};

	let chartData = createChartData(height,tetaS,a2,a,b2,b);
	// console.log(chartData);
	return chartData;
}

//создание БД для построение графкиа
function createChartData(height,tetaS,a2,a,b2,b) {
		let devider = 100; 
		let sliceHieght = height/devider; //разделим вводимое значение высоты на части, чтобы сделать точки абсциссы будущего графика.

		let dataPlot = [];

		for (let i = 0; i < (devider); i++) {

			dataPlot.push( {"height": sliceHieght*(i+1),
			"pressure": calcSumPressure(sliceHieght*(i+1),tetaS,a2,a,b2,b),});//записываем данные в массив, чтобы потом использовать их для построения графика
		}

		return dataPlot;
}

//проверка вводимых значений в инпуты
function checkInputs(height,tetaS,a2,a,b2,b) {

	function mask(x) {
		if (x.match("^[0-9]*[.,]?[0-9]+$")) return true;
	}

	//Проверка, на пустые инпуты
	if ((height.length == 0) || (tetaS.length == 0) || (a2.length == 0) || (a.length == 0) || (b2.length == 0) || (b.length == 0)) {
		alert('Заполните все поля!');
		return false;
	}
	//Проверка, на исключение букв в инпутах
	if ((!mask(height)) || (!mask(tetaS)) || (!mask(a2)) || (!mask(a)) || (!mask(b2)) || (!mask(b))) {
		alert('Значения должы быть числовыми!');
		return false;
	}
	// Проверка на то, что вводимые значения будут больше 0
	else if ((Number(height) <= 0) || (Number(tetaS) <= 0) || (Number(a2) <= 0) || (Number(a) <= 0) || (Number(b2) <= 0) || (Number(b) <= 0)){
		alert('Вводимые значения должны быть > 0');
		return false;
	}
	else if (Number(a2) >= (Number(a))) {
		alert('Значение a должно быть > a2');
		return false;
	}
	else if (Number(b2) >= (Number(b))) {
		alert('Значение b должно быть > b2');
		return false;
	}
	else
		{return true;}
	
}


// вычисление суммарной силы контактного давления
function calcSumPressure(height,tetaS,a2,a,b2,b) {

	let P1;
	let P2;
	let P3;
	let P4;
	let sumP;

// Вычисление силы в 1 области
	P1 = a2*2*tetaS*(b-b2)*(1+(1/(2*height))*(b+b2)-b2/height);

// Вычисление силы во 2 области	
	P2 = b2*2*tetaS*(a-a2)*(1+(1/(2*height))*(a+a2)-a2/height);

// Вычисление силы в 3 области	
	P3 = tetaS*(a-a2)*(b-b2)+(2/3)*(tetaS/height)*((a-a2)**3)*(((b-b2)/(((b-b2)**2 + (a-a2)**2)**(1/2)))*(((b-b2)**2)+((a-a2)**2))/((a-a2)**2)+(1/4)*Math.log(Math.abs((b-b2-((((b-b2)**2)+((a-a2)**2))**(1/2)))/(b-b2+((((b-b2)**2)+((a-a2)**2))**(1/2))))));

// Вычисление силы в 4 области	
	P4 = tetaS*(a-a2)*(b-b2)+(1/3)*(tetaS/height)*((b-b2)**3)*(((a-a2)/(((b-b2)**2 + (a-a2)**2)**(1/2)))*(((b-b2)**2)+((a-a2)**2))/((b-b2)**2)+(1/2)*Math.log(Math.abs((a-a2-((((b-b2)**2)+((a-a2)**2))**(1/2)))/(a-a2+((((b-b2)**2)+((a-a2)**2))**(1/2))))));

// Суммарная сисла штамповки рассмотренной зоны
	sumP = Math.trunc(4*(P1+P2+P3+P4)/1000); //выражаем в килоНьютанах
	return sumP;

}

