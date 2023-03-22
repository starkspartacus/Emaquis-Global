	/*  Wizard */
	jQuery(function ($) {
		"use strict";
		// Chose here which method to send the email, available:
		// Simple phpmail text/plain > form_send_multiple_branch_fileupload.php (default)
		// PHPMailer text/html > phpmailer/multiple_branch_phpmailer_fileupload.php
		// PHPMailer text/html SMTP > phpmailer/multiple_branch_phpmailer_fileupload_smtp.php
		// PHPMailer with html template > phpmailer/multiple_branch_phpmailer_fileupload_template.php
		// PHPMailer with html template SMTP> phpmailer/multiple_branch_phpmailer_fileupload_template_smtp.php
		$('form#wrapped').attr('action', 'form_send_multiple_branch_fileupload.php');
		$("#wizard_container").wizard({
			stepsWrapper: "#wrapped",
			submit: ".submit",
			beforeSelect: function (event, state) {
				if ($('input#website').val().length != 0) {
					return false;
				}
				if (!state.isMovingForward)
					return true;
				var inputs = $(this).wizard('state').step.find(':input');
				return !inputs.length || !!inputs.valid();
			}
		}).validate({
			errorPlacement: function (error, element) {
				if (element.is(':radio') || element.is(':checkbox')) {
					error.insertBefore(element.next());
				} else {
					error.insertAfter(element);
				}
			}
		});
	});

	$("#wizard_container").wizard({
		transitions: {
			branchtype: function ($step, action) {
				var branch = $step.find(":checked").val();
				if (!branch) {
					 $("form").valid();
				}
				return branch;
			}
		}
	});

		/* File upload validate size and file type - For details: https://github.com/snyderp/jquery.validate.file*/
		$("form#wrapped")
			.validate({
				rules: {
					fileupload: {
						fileType: {
							types: ["jpg", "jpeg", "png", "pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
						},
						maxFileSize: {
							"unit": "KB",
							"size": 150
						},
						minFileSize: {
							"unit": "KB",
							"size": "2"
						}
					}
				}
			}); 
	