/**
 * This file is part of Shorty.
 *
 * Shorty is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3 of the License.
 *
 * Shorty is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Shorty.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @category   shorty
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPL
 * @copyright  Copyright 2010 Evan Coury (http://www.Evan.pro/)
 * @package    smpp
 */
exports.commands = {};                               // Use commands to look up by command name
exports.command_ids = {                              // Use command_ids to look up by ID
    0x80000000: 'generic_nack',
    0x00000001: 'bind_receiver',
    0x80000001: 'bind_receiver_resp',
    0x00000002: 'bind_transmitter',
    0x80000002: 'bind_transmitter_resp',
    0x00000003: 'query_sm',
    0x80000003: 'query_sm_resp',
    0x00000004: 'submit_sm',
    0x80000004: 'submit_sm_resp',
    0x00000005: 'deliver_sm',
    0x80000005: 'deliver_sm_resp',
    0x00000006: 'unbind',
    0x80000006: 'unbind_resp',
    0x00000007: 'replace_sm',
    0x80000007: 'replace_sm_resp',
    0x00000008: 'cancel_sm',
    0x80000008: 'cancel_sm_resp',
    0x00000009: 'bind_transceiver',
    0x80000009: 'bind_transceiver_resp',
    0x0000000B: 'outbind',
    0x00000015: 'enquire_link',
    0x80000015: 'enquire_link_resp',
    0x00000021: 'submit_multi',
    0x80000021: 'submit_multi_resp',
    0x00000102: 'alert_notification',
    0x00000103: 'data_sm',
    0x80000103: 'data_sm_resp'
};

// Reverse coomand_ids into commands so we can have easy lookup either way!
for (var command_id in exports.command_ids) {
    exports.commands[ exports.command_ids[command_id] ] = command_id;
}

exports.readPdu = function(pdu) {
        dataStr = pdu.toString('binary');
        pdu = {};
        pdu['length'] = ((dataStr.charCodeAt(0) & 0xFF) << 24) +
                        ((dataStr.charCodeAt(1) & 0xFF) << 16) +
                        ((dataStr.charCodeAt(2) & 0xFF) << 8) +
                        ((dataStr.charCodeAt(3) & 0xFF));
        pdu['command_id'] = ((dataStr.charCodeAt(4) & 0xFF) << 24) +
                        ((dataStr.charCodeAt(5) & 0xFF) << 16) +
                        ((dataStr.charCodeAt(6) & 0xFF) << 8) +
                        ((dataStr.charCodeAt(7) & 0xFF));
        pdu['command_status'] = ((dataStr.charCodeAt(8) & 0xFF) << 24) +
                        ((dataStr.charCodeAt(9) & 0xFF) << 16) +
                        ((dataStr.charCodeAt(10) & 0xFF) << 8) +
                        ((dataStr.charCodeAt(11) & 0xFF));
        pdu['sequence_number'] = ((dataStr.charCodeAt(12) & 0xFF) << 24) +
                        ((dataStr.charCodeAt(13) & 0xFF) << 16) +
                        ((dataStr.charCodeAt(14) & 0xFF) << 8) +
                        ((dataStr.charCodeAt(15) & 0xFF));
        pdu['body'] = '';
        if ((pdu['length'] - 16) > 0) {
            for (i = 16; i < pdu['length']; i++) {
                pdu['body'] += dataStr.charAt(i);
            }
        }
        return pdu;
};

exports.pack = function(format) {
    var packed = '';
    var argi = 1;
    for (i = 0; i < format.length; i++) {
        var chr = format.charAt(i);
        var arg = arguments[argi];
        var num = '';
        switch (chr) {
            case 'A':
                num = '';
                while (format.charAt(i+1).match(/^\d$/)){
                    num = num + format.charAt(i+1);
                    i++;
                }
                if (num.length == 0) {
                    num = 1;
                }
                num = parseInt(num);
                for (j = 0; j <= num; j++) {
                    var chrj = arg.charAt(j);
                    if (j > arg.length) {
                        packed += ' ';
                    } else {
                        packed += chrj;
                    }
                }
                argi++;
                break;
            case 'a':
                num = '';
                while (format.charAt(i+1).match(/^\d$/)) {
                    num = num + format.charAt(i+1);
                    i++;
                }
                if (num.length == 0) {
                    num = 1;
                }
                num = parseInt(num);
                for (j = 0; j <= num; j++) {
                    var chrj = arg.charAt(j);
                    if (j > arg.length) {
                        packed += "\0";
                    } else {
                        packed += chrj;
                    }
                }
                argi++;
                break;
            case 'C':
            case 'c':
                num = '';
                while (format.charAt(i+1).match(/^\d$/)) {
                    num = num + format.charAt(i+1);
                    i++;
                }
                if (num.length == 0) {
                    num = 1;
                }
                num = parseInt(num);
                for (j = 1; j <= num; j++) {
                    packed += String.fromCharCode(arg);
                    argi++;
                    var arg = arguments[argi];
                }
                break;
            case 'N':
                num = '';
                while (format.charAt(i+1).match(/^\d$/)) {
                    num = num + format.charAt(i+1);
                    i++;
                }
                if (num.length == 0) {
                    num = 1;
                }
                num = parseInt(num);
                for (j = 1; j <= num; j++) {
                    packed += String.fromCharCode((arg >> 24) & 255, (arg >> 16) & 255, (arg >> 8) & 255, arg & 255);
                    argi++;
                    var arg = arguments[argi];
                }
                break;
        }
    }
    return packed;
};