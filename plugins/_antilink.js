let handler = (m) => m;

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
handler.before = async function (m, { user, isBotAdmin, isAdmin }) {
	if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup) return true;

	let chat = global.db.data.chats[m.chat];
	let isGroupLink = linkRegex.exec(m.text);
	if (chat.antiLink && isGroupLink) {
		await m.reply(
			Func.texted(
				'bold',
				`@${m.sender.replace(/@.+/g, '')} Terdeteksi mengirimkan link grup.`
			)
		);
		if (isAdmin)
			return m.reply(Func.texted('bold', 'Bot tidak bisa mengeKick Admin!.'));
		if (!isBotAdmin) return m.reply(Func.texted('bold', 'Bot bukan Admin!.'));
		let linkGC =
			'https://chat.whatsapp.com/' + (await conn.groupInviteCode(m.chat));
		let isLinkconnGc = new RegExp(linkGC, 'i');
		let isgclink = isLinkconnGc.test(m.text);
		if (isgclink)
			return m.reply(
				Func.texted('bold', `Link grup terdeteksi pesan akan dihapus.`)
			);
		await conn.delay(5000);
		//await conn.sendMessage(m.chat, { delete: m.key })
		conn.sendMessage(m.chat, {
			delete: {
				remoteJid: m.chat,
				fromMe: false,
				id: m.key.id,
				participant: m.sender,
			},
		});
		await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
	}
	return true;
};

module.exports = handler
