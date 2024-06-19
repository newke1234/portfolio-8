<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Accept");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('NOLOGIN', '1');
// TO DO : mettre le bon chemin vers main.inc.php
require '../../main.inc.php';
if (isset($_SESSION['newtoken'])) $_SESSION['token'] = $_SESSION['newtoken'];

// Save in $_SESSION['newtoken'] what will be next token. Into forms, we will add param token = $_SESSION['newtoken']
$token = dol_hash(uniqid(mt_rand(), true)); // Generates a hash of a random number
$_SESSION['newtoken'] = $token;
dol_syslog("NEW TOKEN reclaimed by : " . $_SERVER['PHP_SELF'], LOG_DEBUG);
$action = GETPOST('action', 'aZ09');
if ($action == 'create_ticket') {
	require_once DOL_DOCUMENT_ROOT.'/ticket/class/actions_ticket.class.php';
	require_once DOL_DOCUMENT_ROOT.'/core/lib/ticket.lib.php';
	require_once DOL_DOCUMENT_ROOT.'/core/class/extrafields.class.php';
	require_once DOL_DOCUMENT_ROOT.'/user/class/user.class.php';
	$object_t = new Ticket($db);
	$extrafields = new ExtraFields($db);
	$extrafields->fetch_name_optionals_label($object_t->table_element);
	
	$error = 0;
	$origin_email = GETPOST('email', 'alpha');
	if (empty($origin_email)) {
		$error++;
		array_push($object_t->errors, $langs->trans("ErrorFieldRequired", $langs->transnoentities("Email")));
		echo "Erreur : ".$langs->trans("ErrorFieldRequired", $langs->transnoentities("Email"));
		$action = '';
	} else {
		// Search company saved with email
		$searched_companies = $object_t->searchSocidByEmail($origin_email, '0');

		// Chercher un contact existant avec cette adresse email
		// Le premier contact trouvé est utilisé pour déterminer le contact suivi
		$contacts = $object_t->searchContactByEmail($origin_email);

		// Option to require email exists to create ticket
		if (!empty($conf->global->TICKET_EMAIL_MUST_EXISTS) && !$contacts[0]->socid) {
			$error++;
			array_push($object_t->errors, $langs->trans("ErrorEmailMustExistToCreateTicket"));
			echo "Erreur : ".$langs->trans("ErrorEmailMustExistToCreateTicket");
			$action = '';
		}
	}

	if (!GETPOST("subject", "restricthtml")) {
		$error++;
		array_push($object_t->errors, $langs->trans("ErrorFieldRequired", $langs->transnoentities("Subject")));
		echo "Erreur : ".$langs->trans("ErrorFieldRequired", $langs->transnoentities("Subject"));
		$action = '';
	} elseif (!GETPOST("message", "restricthtml")) {
		$error++;
		array_push($object_t->errors, $langs->trans("ErrorFieldRequired", $langs->transnoentities("message")));
		echo "Erreur : ".$langs->trans("ErrorFieldRequired", $langs->transnoentities("message"));
		$action = '';
	}elseif (strlen(GETPOST("message", "restricthtml")) < 16) {
		$error++;
		array_push($object_t->errors, $langs->trans("ErrorMessagePasPrecis", $langs->transnoentities("message")));
		echo "Erreur : ".$langs->trans("ErrorMessagePasPrecis");
		$action = '';
	}
	// Check email address
	if (!isValidEmail($origin_email)) {
		$error++;
		array_push($object_t->errors, $langs->trans("ErrorBadEmailAddress", $langs->transnoentities("email")));
		echo "Erreur : ".$langs->trans("ErrorBadEmailAddress", $langs->transnoentities("email"));
		$action = '';
	}

	if (!$error) {
		
		$object_t->db->begin();

		$object_t->track_id = generate_random_id(16);

		$object_t->subject = GETPOST("subject", "restricthtml");
		$object_t->message = GETPOST("message", "restricthtml");
		$object_t->origin_email = $origin_email;

		$object_t->type_code = GETPOST("type_code", 'aZ09');
		$object_t->category_code = GETPOST("category_code", 'aZ09');
		$object_t->severity_code = GETPOST("severity_code", 'aZ09');
		if (is_array($searched_companies)) {
			$object_t->fk_soc = $searched_companies[0]->id;
		}
		if (is_array($contacts) and count($contacts) > 0) {
			$object_t->fk_soc = $contacts[0]->socid;
			$usertoassign = $contacts[0]->id;
		}
		$ret = $extrafields->setOptionalsFromPost(null, $object_t);
		// Generate new ref
		$object_t->ref = $object_t->getDefaultRef();
		if (!is_object($user)) {
			$user = new User($db);
		}
		$object_t->context['disableticketemail'] = 1; // Disable emails sent by ticket trigger when creation is done from this page, emails are already sent later

		$id = $object_t->create($user);
		if ($id <= 0) {
			$error++;
			$errors = ($object_t->error ? array($object_t->error) : $object_t->errors);
			array_push($object_t->errors, $object_t->error ? array($object_t->error) : $object_t->errors);
			$action = 'create_ticket';
		}

		if (!$error && $id > 0) {
			if ($usertoassign > 0) {
				$object_t->add_contact($usertoassign, "SUPPORTCLI", 'external', 0);
			}
		}

		if (!$error) {
			$object_t->db->commit();
			$action = "infos_success";
		} else {
			$object_t->db->rollback();
			setEventMessages($object_t->error, $object_t->errors, 'errors');
			$action = 'create_ticket';
		}

		if (!$error) {
			$res = $object_t->fetch($id);
			if ($res) {
				// Create form object_t
				include_once DOL_DOCUMENT_ROOT.'/core/class/html.formmail.class.php';
				include_once DOL_DOCUMENT_ROOT.'/core/lib/files.lib.php';
				$formmail = new FormMail($db);

				// Init to avoid errors
				$filepath = array();
				$filename = array();
				$mimetype = array();

				$attachedfiles = $formmail->get_attached_files();
				$filepath = $attachedfiles['paths'];
				$filename = $attachedfiles['names'];
				$mimetype = $attachedfiles['mimes'];

				// Send email to customer

				$subject = '['.$conf->global->MAIN_INFO_SOCIETE_NOM.'] '.$langs->transnoentities('TicketNewEmailSubject', $object_t->ref, $object_t->track_id);
				$message  = ($conf->global->TICKET_MESSAGE_MAIL_NEW ? $conf->global->TICKET_MESSAGE_MAIL_NEW : $langs->transnoentities('TicketNewEmailBody')).'<br><br>';
				$message .= $langs->transnoentities('TicketNewEmailBodyInfosTicket').'<br>';

				//$url_public_ticket = ($conf->global->TICKET_URL_PUBLIC_INTERFACE ? $conf->global->TICKET_URL_PUBLIC_INTERFACE.'/' : dol_buildpath('/public/ticket/view.php', 2)).'?track_id='.$object_t->track_id;
				$url_public_ticket = ($conf->global->TICKET_URL_PUBLIC_INTERFACE ? $conf->global->TICKET_URL_PUBLIC_INTERFACE : dol_buildpath('/public/ticket/view.php', 2)).'?track_id='.$object_t->track_id;
				$infos_new_ticket = $langs->transnoentities('TicketNewEmailBodyInfosTrackId', '<a href="'.$url_public_ticket.'" rel="nofollow noopener">'.$object_t->track_id.'</a>').'<br>';
				$infos_new_ticket .= $langs->transnoentities('TicketNewEmailBodyInfosTrackUrl').'<br><br>';

				$message .= $infos_new_ticket;
				$message .= $conf->global->TICKET_MESSAGE_MAIL_SIGNATURE ? $conf->global->TICKET_MESSAGE_MAIL_SIGNATURE : $langs->transnoentities('TicketMessageMailSignatureText');

				$sendto = GETPOST('email', 'alpha');

				$from = $conf->global->MAIN_INFO_SOCIETE_NOM.'<'.$conf->global->TICKET_NOTIFICATION_EMAIL_FROM.'>';
				$replyto = $from;
				$sendtocc = '';
				$deliveryreceipt = 0;

				if (!empty($conf->global->TICKET_DISABLE_MAIL_AUTOCOPY_TO)) {
					$old_MAIN_MAIL_AUTOCOPY_TO = $conf->global->MAIN_MAIL_AUTOCOPY_TO;
					$conf->global->MAIN_MAIL_AUTOCOPY_TO = '';
				}
				include_once DOL_DOCUMENT_ROOT.'/core/class/CMailFile.class.php';
				$mailfile = new CMailFile($subject, $sendto, $from, $message, $filepath, $mimetype, $filename, $sendtocc, '', $deliveryreceipt, -1, '', '', 'tic'.$object_t->id, '', 'ticket');
				if ($mailfile->error || $mailfile->errors) {
					setEventMessages($mailfile->error, $mailfile->errors, 'errors');
				} else {
					$result = $mailfile->sendfile();
				}
				if (!empty($conf->global->TICKET_DISABLE_MAIL_AUTOCOPY_TO)) {
					$conf->global->MAIN_MAIL_AUTOCOPY_TO = $old_MAIN_MAIL_AUTOCOPY_TO;
				}

				// Send email to TICKET_NOTIFICATION_EMAIL_TO
				$sendto = $conf->global->TICKET_NOTIFICATION_EMAIL_TO;
				if ($sendto) {
					$subject = '['.$conf->global->MAIN_INFO_SOCIETE_NOM.'] '.$langs->transnoentities('TicketNewEmailSubjectAdmin', $object_t->ref, $object_t->track_id);
					$message_admin = $langs->transnoentities('TicketNewEmailBodyAdmin', $object_t->track_id).'<br><br>';
					$message_admin .= '<ul><li>'.$langs->trans('Title').' : '.$object_t->subject.'</li>';
					$message_admin .= '<li>'.$langs->trans('Type').' : '.$object_t->type_label.'</li>';
					$message_admin .= '<li>'.$langs->trans('Category').' : '.$object_t->category_label.'</li>';
					$message_admin .= '<li>'.$langs->trans('Severity').' : '.$object_t->severity_label.'</li>';
					$message_admin .= '<li>'.$langs->trans('From').' : '.$object_t->origin_email.'</li>';
					// Extrafields
					$extrafields->fetch_name_optionals_label($object_t->table_element);
					if (is_array($object_t->array_options) && count($object_t->array_options) > 0) {
						foreach ($object_t->array_options as $key => $value) {
							$key = substr($key, 8); // remove "options_"
							$message_admin .= '<li>'.$langs->trans($extrafields->attributes[$object_t->element]['label'][$key]).' : '.$extrafields->showOutputField($key, $value).'</li>';
						}
					}
					$message_admin .= '</ul>';

					$message_admin .= '</ul>';
					$message_admin .= '<p>'.$langs->trans('Message').' : <br>'.$object_t->message.'</p>';
					$message_admin .= '<p><a href="'.dol_buildpath('/ticket/card.php', 2).'?track_id='.$object_t->track_id.'" rel="nofollow noopener">'.$langs->trans('SeeThisTicketIntomanagementInterface').'</a></p>';

					$from = $conf->global->MAIN_INFO_SOCIETE_NOM.' <'.$conf->global->TICKET_NOTIFICATION_EMAIL_FROM.'>';
					$replyto = $from;

					if (!empty($conf->global->TICKET_DISABLE_MAIL_AUTOCOPY_TO)) {
						$old_MAIN_MAIL_AUTOCOPY_TO = $conf->global->MAIN_MAIL_AUTOCOPY_TO;
						$conf->global->MAIN_MAIL_AUTOCOPY_TO = '';
					}
					include_once DOL_DOCUMENT_ROOT.'/core/class/CMailFile.class.php';
					$mailfile = new CMailFile($subject, $sendto, $from, $message_admin, $filepath, $mimetype, $filename, $sendtocc, '', $deliveryreceipt, -1, '', '', 'tic'.$object_t->id, '', 'ticket');
					if ($mailfile->error || $mailfile->errors) {
						setEventMessages($mailfile->error, $mailfile->errors, 'errors');
					} else {
						$result = $mailfile->sendfile();
					}
					if (!empty($conf->global->TICKET_DISABLE_MAIL_AUTOCOPY_TO)) {
						$conf->global->MAIN_MAIL_AUTOCOPY_TO = $old_MAIN_MAIL_AUTOCOPY_TO;
					}
				}
			}

			// Copy files into ticket directory
			$destdir = $conf->ticket->dir_output.'/'.$object_t->ref;
			if (!dol_is_dir($destdir)) {
				dol_mkdir($destdir);
			}
			foreach ($filename as $i => $val) {
				dol_move($filepath[$i], $destdir.'/'.$filename[$i], 0, 1);
				$formmail->remove_attached_files($i);
			}

			//setEventMessages($langs->trans('YourTicketSuccessfullySaved'), null, 'mesgs');

			// Make a redirect to avoid to have ticket submitted twice if we make back
			$messagetoshow = $langs->trans('MesgInfosPublicTicketCreatedWithTrackId', '{s1}', '{s2}');
			$messagetoshow = str_replace(array('{s1}', '{s2}'), array('<strong>'.$object_t->track_id.'</strong>', '<strong>'.$object_t->ref.'</strong>'), $messagetoshow);
			setEventMessages($messagetoshow, null, 'warnings');
			setEventMessages($langs->trans('PleaseRememberThisId'), null, 'warnings');
			echo $messagetoshow;
			//header("Location: index.php");
			//exit;
		}
	} else {
		setEventMessages($object_t->error, $object_t->errors, 'errors');
	}
}
?>