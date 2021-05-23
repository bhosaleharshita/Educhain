
let enrollUser = () => {
	const uname = document.getElementById('uname').value;
	
	$.post('http://localhost:3000/enrollUser', {uname: uname})
			.done((result) => {
				console.log(result);
				if (result.status === 'success') {
					$(".studentTable").append(
							"<tr>" +
							"<td>1</td>" +
							"<td id='uname'>" + result.uname + "</td>" +
							"</tr>"
					);
				} else {
					$(".error-toast").toast('show');
				}
			})
			.fail((xhr, status, error) => {
				$(".error-toast").toast('show');
			});
};
