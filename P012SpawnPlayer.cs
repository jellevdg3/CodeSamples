using MCRPG.src.core.stream;
using MCRPG.src.core.util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

/* 
 * P012SpawnPlayer - Written by Jelle van der Gulik
 * Packet from my C# Minecraft server that uses the Minecraft Networking Protocol.
 * Minecraft Protocol: https://wiki.vg/Protocol
 */

namespace MCRPG.src.game.packets.play.server
{
    class P012SpawnPlayer : IPacket
    {
        public int entitiyId;
        public string uuid;
        public string username;
        public int dataCount;
        public Data[] data;
        public double x;
        public double y;
        public double z;
        public float yaw;
        public float pitch;
        public short curItem;
        public List<MetaData> metaDatas = new List<MetaData>();

        public class Data
        {
            public string name;
            public string value;
            public string signature;
        }
        
        // Get packet data length. (Packet protocol requires us to know the length before we write the packet)
        public override int getLength(AdvancedStream s)
        {
            int dataLength = 0;
            if (data != null)
            {
                for (int i = 0; i < data.Length; i++)
                {
                    Data d = data[i];
                    dataLength += s.getLengthVarInt(d.name.Length) + d.name.Length;
                    dataLength += s.getLengthVarInt(d.value.Length) + d.value.Length;
                    dataLength += s.getLengthVarInt(d.signature.Length) + d.signature.Length;
                }
            }

            int metaDataLength = 0;
            foreach (MetaData metadata in metaDatas)
            {
                metaDataLength += metadata.getLength(s) + 1;
            }

            metaDataLength += 1; // end

            return
            + s.getLengthVarInt(entitiyId) // entitiyId
            + s.getLengthVarInt(uuid.Length) + uuid.Length // uuid
            + s.getLengthVarInt(username.Length) + username.Length // username
            + s.getLengthVarInt(dataCount) // dataCount
            + dataLength // data
            + 4 // x
            + 4 // y
            + 4 // z
            + 1 // yaw
            + 1 // pitch
            + 2 // curItem
            + metaDataLength // metaDatas
            ;
        }

        // Write packet data.
        public override bool Write(AdvancedStream s)
        {
            s.WriteVarInt(entitiyId);
            s.WriteString(uuid);
            s.WriteString(username);
            s.WriteVarInt(dataCount);

            if (data != null)
            {
                for (int i = 0; i < data.Length; i++)
                {
                    s.WriteString(data[i].name);
                    s.WriteString(data[i].value);
                    s.WriteString(data[i].signature);
                }
            }

            s.WriteInt((int)(x * 32.0));
            s.WriteInt((int)(y * 32.0));
            s.WriteInt((int)(z * 32.0));
            s.WriteByte((byte)(256.0f / 360.0f * (this.yaw % 360.0f)));
            s.WriteByte((byte)(256.0f / 360.0f * (this.pitch % 360.0f)));
            s.WriteShort(curItem);

            // meta data
            foreach (MetaData metadata in metaDatas)
            {
                // header
                s.WriteByte((byte)((metadata.type << 5) + metadata.index));
                // data
                metadata.Write(s);
            }

            // end
            s.WriteByte(127);

            return false;
        }
    }
}
