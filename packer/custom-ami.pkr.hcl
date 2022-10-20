variable "aws_region" {
  type    = string
  default = "us-east-1"
}
variable "ami_source_owner" {
  type    = string
  default = "735786237983"
}
variable "source_ami" {
  type    = string
  default = "ami-08c40ec9ead489470" # Ubuntu 22.04 LTS
}
variable "ssh_username" {
  type    = string
  default = "ubuntu"
}
variable "subnet_id" {
  type    = string
  default = "subnet-084233cf79e451c4c"
}
// variable "vpc_id" {
//   type    = string
//   default = "vpc-02b8d795df37b8a79"
// }
// variable "aws_access_key" {
//   type    = string
//   default = env("AWS_ACCESS_KEY_ID")
// }
// variable "aws_secret_key" {
//   type    = string
//   default = env("AWS_SECRET_ACCESS_KEY")
// }
# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "my-ami" {
  ami_users       = ["735786237983", "154872826991"]
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  ami_regions = [
    "us-east-1",
  ]
  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }
  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"
  ssh_timeout   = "30m"
  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 8
    volume_type           = "gp2"
  }
}
build {
  sources = ["source.amazon-ebs.my-ami"]
  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    inline = [
      "echo #####################################started provisoners",
    ]
  }
  provisioner "file" {
    source      = "webapp.zip"
    destination = "/home/ubuntu/webapp.zip"
  }
  provisioner "file" {
    destination = "/home/ubuntu/webapp.service"
    source      = "webapp.service"
  }

  provisioner "file" {
    destination = "/home/ubuntu/node_start.sh"
    source      = "node_start.sh"
  }

  provisioner "shell" {
    scripts = ["setup.sh"]
  }
}